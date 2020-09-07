/* ******************************************************************************
 * logger.js                                                                    *
 * *************************************************************************/ /**
 *
 * @fileoverview A very rudimentary logger
 *
 * logger is a poor man's cheap logger for client code.
 *
 * It provides debug, info, warn and error logging to the console, with the
 * ability to set the log level such that only log messages of a certain
 * level will be logged.
 *
 * Created on        April 15, 2019
 * @author           Michael Jay Lippert
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

/* eslint-disable no-console, no-empty-function */
// Noop function to use for disabled log levels
const noopFn = () => {};

const log = console.log.bind(window.console);
const debugLog = console.debug ? console.debug.bind(window.console) : log;
const infoLog = console.info ? console.info.bind(window.console) : log;
const warnLog = console.warn.bind(window.console);
const errorLog = console.error.bind(window.console);
/* eslint-enable no-console, no-empty-function */

// TODO: change the config from just debug true/false to specifying a level.
const configLogLevel = window.client_config.react_app_debug ? 'debug' : 'info';

/**
 * logger is a poor man's cheap logger for client code.
 *
 * It mostly just redirects to using the window console
 * log, EXCEPT it allows setting a log level which will
 * disable all logging of a lower level (debug is lowest,
 * error is highest).
 *
 * By using this logger instead of console.log directly
 * we can more easily replace all logging with a fancier
 * logger package w/ more functionality at some later time
 * if desired.
 */
const logger = {
    debug: debugLog,
    info: infoLog,
    warn: warnLog,
    error: errorLog,

    setLogLevel(level) {
        this.debug = noopFn;
        this.info = noopFn;
        this.warn = noopFn;
        this.error = noopFn;

        /* eslint-disable no-fallthrough */
        switch (level) {
            case 'debug':
                this.debug = debugLog;
            case 'info':
                this.info = infoLog;
            case 'warn':
                this.warn = warnLog;
            case 'error':
                this.error = errorLog;
        }
        /* eslint-enable no-fallthrough */
    },

    getLogLevel() {
        return configLogLevel;
    },
};

logger.setLogLevel(configLogLevel);


/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    logger,
};
