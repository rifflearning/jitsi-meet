/* ******************************************************************************
 * riffClient.js                                                                *
 * *************************************************************************/ /**
 *
 * @fileoverview Client utilities to work with Riff services
 *
 * Currently provides a place to keep the riffdata server connection
 * (feathers app)
 *
 * Created on       January 3, 2022
 * @author          Jordan Reedie
 *
 * @copyright (c) 2022 Riff Analytics,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

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

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    getRiffApp,
    setRiffApp,
};
