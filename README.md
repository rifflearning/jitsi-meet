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

Ensure you have a value set for your git user name (`git config --get user.name` should return your name)

Create `.env` file in root dir:

```
## Local development:
## This is the backend that will be used when developing locally
WEBPACK_DEV_SERVER_PROXY_TARGET=https://example.riffplatform.com

```

Run the webpack dev server:

```
make dev
```

This will capture your local changes while using the backend you've specified in your .env file

## Riff Specific Configuration

Configuration that is specific to Riff lives in `riff_config.js`. When you are developing locally,
you should note that the changes you make to the `riff_config.js` will not be reflected in the webpack dev
server. If you wish to test changes or additions to the `riff_config.js` file, you can add them as special URL parameters in the format:
`<urlBase>/any/path/#riffConfig.example.enableSomeThing=true&riffConfig.example.someValue=test`
Note the use of `#` - jitsi has a special handler that interprets all of the parameters after the `#` as config overrides.
For example, if you wish to enable experimental metrics:
`https://0.0.0.0:8080/#riffConfig.metrics.showExperimentalMetrics=true`

Note that this requires the riff_config.js file that is on the server you are using
as your backend to have the `window.riffConfig = riffConfig` line uncommented at the bottom.

---
## Customization and deployment to AWS

### Deployment to Riff AWS development test instance

The instance should have been created and initialized as a Riff production riffremote or riffplatform site.

You will need to have the ssh key for that instance. For example you may have the ssh key
stored locally on your machine as `~/.ssh/riffdev_1_useast2_key.pem`.

You will also need to know the Public IP address of the instance or the DNS name. Currently
you alway use the `ubuntu` user to connect to those instances.

You will need the following 2 definitions in the `.env` file:

```
AWS_NAME=ubuntu@example.riffplatform.com
PEM_PATH=~/.ssh/riffdev_1_useast2_key.pem
```

These are example values. The example for `AWS_NAME` assumes that you are using the known DNS
name for the instance, ex. `example.riffplatform.com`. You should replace the value with wherever you
are planning to deploy to. And the value of `PEM_PATH`
is to the ssh key discussed as an example above.

It is recommended that you actually put these values in the file `env-dev` and make `.env` link to
that file. This allows relinking `.env` to a file with different values without losing your settings.
`env-dev` has been added to `.gitignore` so you won't accidentally commit it. It should not be committed
because different developers will need different values in this file.

```
ln -f -s env-dev .env
```

Once these values are set correctly in your `.env` file you can package and deploy the source in
the working directory with the `deploy-aws` Makefile target.

```
make deploy-aws
```

This will build the current sources into a deployment package named `rifflearning-jitsi-meet-dev.tar.bz2`,
copy it to the instance, and unpackage it there.

---
### Outdated deployment docs that have not been updated yet (still has useful information)
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
    AWS_NAME=ubuntu@dev-jitsi.riffplatform.com
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

    //the name of the toolbar buttons to display in the toolbar
    toolbarButtons: [
        'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
        'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
        'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
        'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
        'select-background', 'download', 'help', 'mute-everyone', 'mute-video-everyone',
        'security', 'meetingmediator', 'rifflocalrecording'
    ],
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

## Documentation

All the Jitsi Meet documentation is available in [the handbook](https://jitsi.github.io/handbook/).

## Security

For a comprehensive description of all Jitsi Meet's security aspects, please check [this link](https://jitsi.org/security).

For a detailed description of Jitsi Meet's End-to-End Encryption (E2EE) implementation,
please check [this link](https://jitsi.org/e2ee-whitepaper/).

For information on reporting security vulnerabilities in Jitsi Meet, see [SECURITY.md](./SECURITY.md).

<br />
<br />

<footer>
<p align="center" style="font-size: smaller;">
Built with ❤️ by the Jitsi team at <a href="https://8x8.com" target="_blank">8x8</a> and our community.
</p>
</footer>
