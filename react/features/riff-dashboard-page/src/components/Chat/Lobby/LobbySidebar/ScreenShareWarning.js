/* ******************************************************************************
 * ScreenShareWarning.jsx                                                       *
 * *************************************************************************/ /**
 *
 * @fileoverview React component to display a warning to the user
 *  if screen sharing is unavailable
 *
 * Warn the user if screen sharing is unavailable and tell them
 * specifically how to fix it based on which browser/version they are using
 *
 * Created on       May 13, 2019
 * @author          Jordan Reedie
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/
import React from 'react';

import WarningIcon from '@material-ui/icons/Warning';
import { detect } from 'detect-browser';

import { isScreenShareSourceAvailable } from 'libs/utils';

class ScreenShareWarning extends React.PureComponent {

    constructor(props) {
        super(props);
        this.browser = detect();
    }

    render() {
        // FIXME is it clearer to call this function in the parent component
        // and pass it as a boolean prop here?
        if (isScreenShareSourceAvailable()) {
            // if the user has a screen sharing source available,
            // obviously we don't need to warn them that they can't
            // share their screen. don't render anything
            return null;
        }

        let text = <p/>;
        const alertText = 'Copy and paste "chrome://flags/#enable-experimental' +
            '-web-platform-features" into your address bar, toggle the ' +
            'button to "Enabled", and relaunch Chrome.';

        const howToEnableAlert = (e) => {
            e.preventDefault();
            alert(alertText);
        };

        const browser = this.browser;
        switch (browser && browser.name) {
            case 'chrome': {
                const version = parseInt(browser.version.split('.')[0]);
                if (version >= 70) {
                    text = (
                        <p>
                            {
                                'Screen Sharing is Disabled. ' +
                                'To enable screen sharing, please '
                            }
                            <a href="#" onClick={howToEnableAlert}>
                                { 'turn on experimental features ' }
                            </a>
                            { 'in Chrome.' }
                        </p>
                    );
                }
                else {
                    text = (
                        <p>
                            {
                                'Screen Sharing is Disabled. ' +
                                'Please update Chrome to the latest version ' +
                                'to use screen sharing. '
                            }
                        </p>
                    );
                }
                break;
            }
            case 'firefox':
                text = (
                    <p>
                        {
                            'Screen Sharing is Disabled. ' +
                            'Please make sure you have the latest version ' +
                            'of Firefox to use screen sharing. '
                        }
                    </p>
                );
                break;
            default:
                text = (
                    <p>
                        {
                            'Screen sharing is not supported in this browser. ' +
                            'Please use the latest version of Chrome or Firefox ' +
                            'to enable screen sharing.'
                        }
                    </p>
                );
        }


        return (
            <div style={{ paddingBottom: '20px' }}>
                <WarningIcon style={{ color: '#f44336' }}/>
                <div>
                    {text}
                </div>
            </div>
        );

    }

}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    ScreenShareWarning,
};
