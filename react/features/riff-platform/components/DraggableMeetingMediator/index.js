/* global process */
/* eslint-disable max-len */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable-next-line import/order */

import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Draggable from 'react-draggable';

import { Icon, IconClose } from '../../../base/icons';
import { connect } from '../../../base/redux';
import { toggleMeetingMediator } from '../../actions/meetingMediator';

import { MeetingMediator } from './MeetingMediator';

const DraggableMeetingMediator = ({ displayName, webRtcPeers, isOpen, toggleMediator, isAnon }) => {

    const size = useWindowSize();
    const bounds = { left: -200,
        top: -250,
        right: size.width - 26,
        bottom: size.height - 26 };

    const onCloseMeetingMediator = () => toggleMediator();

    useEffect(() => {
        if (process.env.HIDE_MEETING_MEDIATOR_BY_DEFAULT_FOR_ANON_USER === 'true' && isAnon) {
            toggleMediator(false);
        }
    }, [ isAnon ]);

    return (
        <Draggable bounds = { bounds }>
            <div
                className = { isOpen ? '' : 'closed' }
                id = 'meeting-mediator-wrapper'>
                <Icon
                    className = 'meeting-mediator-close'
                    onClick = { onCloseMeetingMediator }
                    src = { IconClose } />
                <MeetingMediator
                    displayName = { displayName }
                    isEnabled = { true }
                    webRtcPeers = { webRtcPeers } />
            </div>
        </Draggable>
    );
};

DraggableMeetingMediator.propTypes = {
    displayName: PropTypes.string,
    isAnon: PropTypes.bool,
    isOpen: PropTypes.bool,
    toggleMediator: PropTypes.func,
    webRtcPeers: PropTypes.array
};


/**
 * Maps (parts of) the Redux state to the associated props for the
 * {@code Conference} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {Props}
 */
function _mapStateToProps(state) {
    return {
        displayName: state['features/riff-platform'].signIn.user?.displayName || '',
        isAnon: state['features/riff-platform'].signIn.user?.isAnon,
        isOpen: state['features/riff-platform'].meetingMediator.isOpen,
        webRtcPeers: state['features/base/participants'].map((p, i) => {
            if (i === 0) {
                const { uid, displayName } = state['features/riff-platform'].signIn.user || {};

                return { nick: `${uid}|${displayName}` };
            }

            return { nick: p.name };
        })
    };
}

/**
 * Maps part of redux actions to component's props.
 *
 * @param {Function} dispatch - Redux's {@code dispatch} function.
 * @private
 * @returns {Object}
 */
function _mapDispatchToProps(dispatch) {
    return {
        toggleMediator: bool => dispatch(toggleMeetingMediator(bool))
    };
}

export default connect(_mapStateToProps, _mapDispatchToProps)(DraggableMeetingMediator);


/**
 * React hook for tracking windlow resize.
 *
 * @returns {Object}
 */
function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [ windowSize, setWindowSize ] = useState({
        width: undefined,
        height: undefined
    });

    useEffect(() => {
        /**
         * Handler to call on window resize.
         *
         * @returns {void}
         */
        function handleResize() {
            // Set window width/height to state
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []); // Empty array ensures that effect is only run on mount

    return windowSize;
}
