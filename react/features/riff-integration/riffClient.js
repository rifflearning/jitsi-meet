/** This gives us somewhere to keep our riff data client connection */
let app = null;

/**
 * Returns the Riff Data App
 *
 * @returns {FeathersApp} - The Riff data server connection.
 */
function getRiffApp() {
    if (app === null) {
        // TODO an error or do something else?
        console.error('App has not yet been initialized!');
    }

    return app;
}

/**
 * Sets the Riff Data App
 *
 * @param {FeathersApp} riffApp - The Riff data server connection
 * @returns {void}
 */
function setRiffApp(riffApp) {
    app = riffApp;
}

export {
    getRiffApp,
    setRiffApp,
};
