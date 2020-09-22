#!/bin/bash
# In order to build and deploy to aws instance with jitsi-meet client
# you need to provide enviroment variables to /.env file
# and run "make deploy-aws" or only deploy with "sh deploy-aws.sh".

# Set all vars from .env file, we need for PEM_PATH, AWS_PATH
set -o allexport; source .env; set +o allexport

EXAMPLE_TEXT="Add to /.env file variables:\nPEM_PATH=/path-to-key.pem\nAWS_PATH=username@0.0.0.0\n\nand run 'make deploy-aws'."

if [ -z "$PEM_PATH" ]
  then
    echo "No PEM_PATH provided.\n"
    echo $EXAMPLE_TEXT
    exit 1
fi

if [ -z "$AWS_PATH" ]
  then
    echo "No AWS_PATH provided.\n"
    echo $EXAMPLE_TEXT
    exit 1
fi

# clean
rm -fr temp-deploy-aws
rm -fr temp-deploy-aws.zip

# copy htmls
mkdir temp-deploy-aws
cp index.html temp-deploy-aws/
cp base.html temp-deploy-aws/
cp body.html temp-deploy-aws/
cp head.html temp-deploy-aws/
cp title.html temp-deploy-aws/

# copy root files: js. icons
cp favicon.ico temp-deploy-aws/
cp interface_config.js temp-deploy-aws/

# copy all static
mkdir temp-deploy-aws/static
cp -a static/* temp-deploy-aws/static

# copy css
mkdir temp-deploy-aws/css
cp css/all.css temp-deploy-aws/css/
cp css/dashboard.css temp-deploy-aws/css/

# copy all libs
mkdir temp-deploy-aws/libs
cp libs/* temp-deploy-aws/libs/

# copy all images
mkdir temp-deploy-aws/images
cp images/* temp-deploy-aws/images/

zip -r temp-deploy-aws.zip temp-deploy-aws

# clean
rm -r temp-deploy-aws

# upload to aws instance
scp -i $PEM_PATH temp-deploy-aws.zip $AWS_PATH:/home/ubuntu

# clean locally
rm -fr temp-deploy-aws.zip

# unzip and deploy:
ssh -i $PEM_PATH $AWS_PATH ' \
rm -rf /home/ubuntu/temp-deploy-aws; \
unzip /home/ubuntu/temp-deploy-aws.zip; \
rm /home/ubuntu/temp-deploy-aws.zip; \
sudo mv /home/ubuntu/temp-deploy-aws/css/all.css /usr/share/jitsi-meet/css/;  \
sudo mv /home/ubuntu/temp-deploy-aws/css/dashboard.css /usr/share/jitsi-meet/css/;  \
rm -fr /home/ubuntu/temp-deploy-aws/css; \
sudo rm -fr /usr/share/jitsi-meet/images; \
sudo rm -fr /usr/share/jitsi-meet/libs; \
sudo rm -fr /usr/share/jitsi-meet/static; \
sudo mv /home/ubuntu/temp-deploy-aws/* /usr/share/jitsi-meet/; \
rm -rf /home/ubuntu/temp-deploy-aws; \
'

echo Successfully deployed!