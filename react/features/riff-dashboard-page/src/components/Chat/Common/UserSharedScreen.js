/* ******************************************************************************
 * UserSharedScreen.jsx                                                         *
 * *************************************************************************/ /**
 *
 * @fileoverview React component for the user's shared screen stream
 *
 * Displays the user's shared screen.
 *
 * Created on       January 17, 2019
 * @author          Jordan Reedie
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/
import React from 'react';
import PropTypes from 'prop-types';

import { logger } from 'libs/utils';

class UserSharedScreen extends React.Component {
    static propTypes = {
        screen: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.appendLocalScreen = this.appendLocalScreen.bind(this);
    }

    appendLocalScreen(container) {
        const screen = this.props.screen;
        try {
            // FIXME do we need to set this stuff here?
            screen.height = 175;
            screen.width = 250;
            screen.className = 'local-video';

            // Muting screen so we don't send audio twice
            // (still sending webcam stream)
            // FIXME - i'm not sure this comment is accurate,
            // need to check in on that
            // i'm fairly certain this just prevents the user
            // from hearing themselves
            // -jr
            screen.muted = true;

            container.appendChild(screen);
        }
        catch (err) {
            // it is possible that the connection will end
            // in the middle of trying to display the shared screen
            // this will cause a TypeError
            logger.debug('Screen nulled while rendering', err);
        }
    }

    render() {
        return <div id='local-screen-container' ref={this.appendLocalScreen}/>;
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    UserSharedScreen,
};
