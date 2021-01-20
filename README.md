# Jitsi Meet
## Development:
Running with webpack-dev-server for development:
```
clone https://github.com/rifflearning/jitsi-meet.git
npm install
make dev
```
*Also see official guide here [here](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-web)*.

---
## Development with Riff features:
### Run client:
1. Clone repository, checkout to `develop` or `integration-riff-platform` branch and install dependencies:
    ```
    git clone https://github.com/rifflearning/jitsi-meet.git
    git checkout integration-riff-platform
    npm install
    ```
2. Create `.env` file in root dir (*ask colleagues for the `.env`*):
    ```
    ### Uncomment variables for specific instance deployment:

    ## development mode with webpack:
    API_GATEWAY=https://localhost:4445/api
    RIFF_SERVER_URL=https://riff-poc.riffplatform.com
    NEGOTIATIONS_GROUP_ADMIN_USER_ID=5fbc1698db819207288110d2

    ## Deployment to rif-poc instance:
    # API_GATEWAY=/api-gateway
    # RIFF_SERVER_URL=/
    # NEGOTIATIONS_GROUP_ADMIN_USER_ID=5feb8999575d80a6fe1b2961
    # PEM_PATH=~/.ssh/riffdev_1_useast2_key.pem
    # AWS_NAME=ubuntu@riff-poc.riffplatform.com

    ## Deployment to hls-negotiations instance:
    # API_GATEWAY=/api-gateway
    # RIFF_SERVER_URL=/
    # NEGOTIATIONS_GROUP_ADMIN_USER_ID=5feb890b2802c112989e367e
    # PEM_PATH=~/.ssh/riffdev_1_useast2_key.pem
    # AWS_NAME=ubuntu@hls-negotiations.riffremote.com
    ```
3. Run dev server:
    ```
    make dev
    ```
4. Run api-gateway and mongo locally:
https://github.com/rifflearning/riff-jitsi-platform/tree/main/api-gateway
---
## Customization and deployment to AWS
In order to customize *jitsi-meet* with riff theme, all features and set up a new enviroment please follow next steps:

1. Install Jitsi-Meet to aws with [official guide](https://jitsi.github.io/handbook/docs/devops-guide/devops-guide-quickstart).

2. Deploy *develop* or *integration-riff-platform* branch to the instance:
    ```
    git clone https://github.com/rifflearning/jitsi-meet.git
    git checkout integration-riff-platform
    npm install
    ```
    Add appropriate variables `.env` for deployment and put `.pem` file to `~/.ssh/riffdev_1_useast2_key.pem` (*ask colleagues for the `.env` and `.pem` files*):
    ```
    ### Uncomment variables for specific instance deployment:

    ## development mode with webpack:
    # API_GATEWAY=https://localhost:4445/api
    # RIFF_SERVER_URL=https://riff-poc.riffplatform.com
    # NEGOTIATIONS_GROUP_ADMIN_USER_ID=5fbc1698db819207288110d2

    ## Deployment to rif-poc instance:
    API_GATEWAY=/api-gateway
    RIFF_SERVER_URL=/
    NEGOTIATIONS_GROUP_ADMIN_USER_ID=5feb8999575d80a6fe1b2961
    PEM_PATH=~/.ssh/riffdev_1_useast2_key.pem
    AWS_NAME=ubuntu@riff-poc.riffplatform.com

    ## Deployment to hls-negotiations instance:
    # API_GATEWAY=/api-gateway
    # RIFF_SERVER_URL=/
    # NEGOTIATIONS_GROUP_ADMIN_USER_ID=5feb890b2802c112989e367e
    # PEM_PATH=~/.ssh/riffdev_1_useast2_key.pem
    # AWS_NAME=ubuntu@hls-negotiations.riffremote.com
    ```
    Build and deploy with:
    ```
    make deploy-aws
    ```
3. Deploy and run [api-gateway](https://github.com/rifflearning/riff-jitsi-platform/tree/main/api-gateway) to aws instance.
4. Add nginx configs to `/etc/nginx/sites-available/riff-poc.riffplatform.com.conf`:
    Insert after `gzip_min_length 512;`:
    ```
    
    # blocks iOS native client
    if ($http_user_agent ~* "^jitsi-meet\/101*") {
        return   403;
    }

    # blocks android native client
    if ($http_user_agent ~* "^okhttp\/*") {
        return   403;
    }
    ```
    Insert after `# BOSH location = /http-bind { ... }`:
    
    (*you may need to set up a new riff-data server instance*)
    ```
    # config for api-gateway for Riff-Jitsi-Platform
    location ^~ /api-gateway/ {
        proxy_pass https://localhost:4445/api/;
    }

    # config for riff-data server:
    location ^~ /api/videodata/socket.io/ {
        proxy_pass http://172.31.6.19:3000/socket.io/;

        # proxy_websocket_params
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_cache_bypass $http_upgrade;

        # cors_params
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified>
        add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range';
    }

    ```
5. Change flags in aws instance file `/etc/jitsi/meet/[host]-config.js`:
    ```
    prejoinPageEnabled: true,
    p2p:{
        enabled: false
    }
    disableDeepLinking: true,
    ```
    Also optional flags:
    ```
    disableSimulcast: true,

    // in case meetings recording by jibri is needed
    fileRecordingsEnabled: true, 

    // depends on videobridge configuration
    openBridgeChannel: 'websocket',

    // in case we want jibri, but value itself different for every domain
    hiddenDomain: 'recorder.example-domain.com',
    ```