/* ******************************************************************************
 * ToggleDocsButton.jsx                                                         *
 * *************************************************************************/ /**
 *
 * @fileoverview React component for button to toggle meeting docs
 *
 * If the button is clicked, it does the following:
 *  - if the user is currently viewing the doc, close it
 *    and display only remote videos
 *  - if the user is not currently viewing the doc, display the doc in
 *    dense video layout
 *
 * Created on       Nov 6, 2019
 * @author          Jordan Reedie
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/
import React from 'react';
import PropTypes from 'prop-types';
import LinkIcon from '@material-ui/icons/Link';
import LinkOffIcon from '@material-ui/icons/LinkOff';

import { MediaActionBtn } from '../../../Common/styled';

class ToggleDocButton extends React.Component {
    static propTypes = {
        /** should the doc be displayed? */
        shouldDisplayDoc: PropTypes.bool.isRequired,

        /** change the display of the doc on or off */
        showDoc: PropTypes.func.isRequired,
    }

    render() {
        let icon = <LinkOffIcon/>;
        const disabled = false;
        let ariaLabel = 'Stop Viewing Link';
        if (!this.props.shouldDisplayDoc) {
            icon = <LinkIcon/>;
            ariaLabel = 'View Link';
        }

        // toggle the display of the doc
        const toggleDisplayDoc = () => this.props.showDoc(!this.props.shouldDisplayDoc);

        return (
            <MediaActionBtn
                inToggledState={this.props.shouldDisplayDoc}
                onClick={toggleDisplayDoc}
                disabled={disabled}
                aria-label={ariaLabel}
                title={ariaLabel}
            >
                {icon}
            </MediaActionBtn>
        );

    }
}

export {
    ToggleDocButton,
};
