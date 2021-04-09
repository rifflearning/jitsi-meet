<p align="center"><img align="center" src="images/jitsilogo.png" /></p>

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

Clone repository, checkout to `develop` branch and install dependencies:

```
git clone https://github.com/rifflearning/jitsi-meet.git
git checkout develop
npm install
```

Create `.env` file in root dir (*ask colleagues for the `.env`*):

```
### Uncomment variables for specific instance deployment:
## Local development:
WEBPACK_DEV_SERVER_PROXY_TARGET=https://dev-jitsi.riffplatform.com
RIFF_SERVER_URL=https://dev-jitsi.riffplatform.com 
API_GATEWAY=https://dev-jitsi.riffplatform.com/api-gateway
# for local api-gateway:
# API_GATEWAY=https://localhost:4445/api



### Deployment common variables:
# PEM_PATH=~/.ssh/riffdev_1_useast2_key.pem
# RIFF_SERVER_URL=/
# API_GATEWAY=/api-gateway
# HIDE_MEETING_MEDIATOR_BY_DEFAULT_FOR_ANON_USER=true

### Deployment specific variables:
## dev-jitsi (DEV):
# AWS_NAME=ubuntu@dev-jitsi.riffplatform.com
# DISABLE_GROUPS=true
# SEND_SIBILANT_VOLUMES_TO_RIFF_DATA_SERVER=true

## rif-poc:
# AWS_NAME=ubuntu@riff-poc.riffplatform.com

## hls-negotiations:
# AWS_NAME=ubuntu@hls-negotiations.riffremote.com
# DISABLE_EMOTIONS_CHART=true

## nd-negotiations:
# AWS_NAME=ubuntu@nd-negotiations.riffremote.com
# DISABLE_EMOTIONS_CHART=true

## pega:
# AWS_NAME=ubuntu@pega.riffremote.com
# DISABLE_EMOTIONS_CHART=true
# DISABLE_GROUPS=true

## staging.riffedu (DEV):
# AWS_NAME=ubuntu@meet.staging.riffedu.com
# MATTERMOST_EMBEDDED_ONLY=true

## said-oxford.riffedu:
# AWS_NAME=ubuntu@meet.said-oxford.riffedu.com
# PEM_PATH=~/.ssh/riffdev_1_euwest2_key.pem
# MATTERMOST_EMBEDDED_ONLY=true



### Avaliable optional features flags:
# DISABLE_GROUPS=true
# DISABLE_EMOTIONS_CHART=true
# MATTERMOST_EMBEDDED_ONLY=true # disables auth, enables "Meeting ended" page instead of admin panel
# SEND_SIBILANT_VOLUMES_TO_RIFF_DATA_SERVER=true # sends utterance obj with additional field 'volumes', for data analysis purposes only
# HIDE_MEETING_MEDIATOR_BY_DEFAULT=true
# HIDE_MEETING_MEDIATOR_BY_DEFAULT_FOR_ANON_USER=true
```

Run dev server:

```
make dev
```
---
## Customization and deployment to AWS
In order to customize *jitsi-meet* with riff theme, all features and set up a new enviroment please follow next steps:

1. Install Jitsi-Meet to aws with [official guide](https://jitsi.github.io/handbook/docs/devops-guide/devops-guide-quickstart).

2. Deploy `develop` branch to the instance:
    ```
    git clone https://github.com/rifflearning/jitsi-meet.git
    git checkout develop
    npm install
    ```
    Add appropriate variables `.env` for deployment and put `.pem` file to `~/.ssh/riffdev_1_useast2_key.pem` (*ask colleagues for the `.env` and `.pem` files*):
    ```
    ### Deployment common variables:
    PEM_PATH=~/.ssh/riffdev_1_useast2_key.pem
    RIFF_SERVER_URL=/
    API_GATEWAY=/api-gateway
    HIDE_MEETING_MEDIATOR_BY_DEFAULT_FOR_ANON_USER=true

    ### Deployment specific variables:

    ## dev-jitsi (DEV):
    AWS_NAME=ubuntu@dev-jitsi.riffplatform.com
    DISABLE_GROUPS=true
    SEND_SIBILANT_VOLUMES_TO_RIFF_DATA_SERVER=true
    ```
    Build and deploy with:
    ```
    make deploy-aws
    ```
3. Deploy and run [api-gateway](https://github.com/rifflearning/riff-jitsi-platform/tree/main/api-gateway) on aws instance.
4. Add nginx configs to `/etc/nginx/sites-available/riff-poc.riffplatform.com.conf`:

    Add to the top of the file:
    ```
    map $http_upgrade $connection_upgrade
    {
        default upgrade;
        '' close;
    }
    ```
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
    Insert after `# BOSH location = /http-bind { ... }` and replace `RIFF_DATA_IP`:
    
    (*you may need to set up a new riff-data server instance*)
    ```
    # config for api-gateway for Riff-Jitsi-Platform
    location ^~ /api-gateway/ {
        proxy_pass https://localhost:4445/api/;
    }

    # config for riff-data server:
    location ^~ /api/videodata/socket.io/ {
        proxy_pass http://RIFF_DATA_IP:3000/socket.io/;

        # proxy_websocket_params
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_cache_bypass $http_upgrade;

        # cors_params
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
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
    localRecording: {
        enabled: true,
        format: 'webm'
    },
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
    
