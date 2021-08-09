/* ******************************************************************************
 * MeetingList.jsx                                                              *
 * *************************************************************************/ /**
 *
 * @fileoverview React Riff Meeting List component
 *
 * Presents a list of Riff meetings allowing one to be selected, calling a
 * supplied handleMeetingClick function.
 *
 * Created on       May 29, 2019
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import React from 'react';
import PropTypes from 'prop-types';
import StickyBox from 'react-sticky-box';

import { logger, setWindowScrolling } from 'libs/utils';

import { MeetingListElement } from './MeetingListElement';

/* ******************************************************************************
 * MeetingList                                                             */ /**
 *
 * React component to present a list of meetings.
 *
 ********************************************************************************/
class MeetingList extends React.Component {
    static propTypes = {

        /** ID of the current user */
        uid: PropTypes.string.isRequired,

        /** The list of meeting objects to be presented */
        meetings: PropTypes.array.isRequired,

        /** The meeting object that is currently selected or null if none is selected
         *  Note: PropTypes has no native way to distinguish between null and undefined
         *        allowing null is why this is "optional"
         */
        selectedMeeting: PropTypes.object,

        /** function to invoke when a meeting is clicked on (will select the meeting) */
        onSelectionChanged: PropTypes.func.isRequired,

        /** is the graphical rendering for all graphs on the dashboard complete? */
        areAllGraphsRendered: PropTypes.bool.isRequired,
    };

    /* **************************************************************************
     * constructor                                                         */ /**
     */
    constructor(props) {
        super(props);

        this._handleMeetingClick = this._handleMeetingClick.bind(this);
    }

    /* **************************************************************************
     * render                                                              */ /**
     *
     * Required method of a React component.
     * @see {@link https://reactjs.org/docs/react-component.html#render|React.Component.render}
     */
    render() {
        logger.debug('MeetingList.render: rendering meetings in list');
        return (
            <StickyBox
                bottom={false}
                offsetTop={25}
                offsetBottom={0}
                // values for oldMode and newMode are enum('relative', 'stickyBottom', 'stickyTop')
                onChangeMode={(/* oldMode, newMode */) => {}}
            >
                <div className='meeting-list-component'>
                    <div className='meeting-list-header'>{'Meetings'}</div>
                    <aside
                        className='meeting-list-elements-container'
                        onMouseEnter={MeetingList._scrollPaneFocus}
                        onMouseLeave={MeetingList._scrollPaneFocus}
                    >
                        {this._getMeetingTiles()}
                    </aside>
                </div>
            </StickyBox>
        );
    }

    /* **************************************************************************
     * _getMeetingTiles                                                    */ /**
     *
     * Returns an array of MeetingListElements for all of the meetings that
     * should be displayed in this MeetingList.
     *
     * (currently *ALL* meetings in the meeting list should be displayed)
     * @private
     *
     * @returns {Array<MeetingListElement>}
     */
    _getMeetingTiles() {
        return this.props.meetings
            .map((meeting) => {
                const selected = this.props.selectedMeeting !== null &&
                                 meeting._id === this.props.selectedMeeting._id;

                const roomName = meeting.title;

                return (
                    <MeetingListElement
                        key={meeting._id}
                        roomName={roomName}
                        meeting={meeting}
                        selected={selected}
                        handleClick={this._handleMeetingClick}
                        areAllGraphsRendered={this.props.areAllGraphsRendered}
                    />
                );
            });
    }

    /* **************************************************************************
     * _handleMeetingClick                                                 */ /**
     *
     * The click handler for a MeetingListElement will select the meeting
     * contained by that element.
     *
     * @param {object} meeting - the meeting object clicked on
     */
    _handleMeetingClick(meeting) {
        setWindowScrolling(true);
        this.props.onSelectionChanged(this.props.uid, meeting);
    }

    /* **************************************************************************
     * _scrollPaneFocus (static)                                           */ /**
     *
     * Handles mouse events on the MeetingTabs element
     *
     * MeetingTabs is used as a scroll pane, and when the user hovers their mouse
     * over the scroll pane, we want to disable the scrolling of the html element,
     * so only the MeetingTabs scroll pane scrolls
     * @private
     *
     * @param {object} e the synthetic event object
     */
    static _scrollPaneFocus(e) {
        // Commenting out because it is working fine and is super noisy
        // logger.debug('MeetingList: scrollPaneFocus', e.type);

        // When the mouse enters the scroll pane, disable window scrolling
        if (e.type === 'mouseenter') {
            setWindowScrolling(false);
        }
        // When the mouse leaves the scroll pane, enable window scrolling
        else if (e.type === 'mouseleave') {
            setWindowScrolling(true);
        }
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    MeetingList,
};
