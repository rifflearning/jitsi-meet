/* @flow */

import React from 'react';

import { connect } from '../../../base/redux';
import { Tooltip } from '../../../base/tooltip';
import MultipleRoomsNameDropdown from '../../../riff-platform/components/Meeting/MultipleRoomsMeetingNameDropdown';

type Props = {

    /**
     * The conference display name.
     */
    _subject: string,

    /**
     * Whether to show name with multiple rooms quantity instead of name.
     */
    _isMultipleRoomsQuantity: boolean,
}

/**
 * Label for the conference name.
 *
 * @param {Props} props - The props of the component.
 * @returns {ReactElement}
 */
const SubjectText = ({ _subject, _isMultipleRoomsQuantity }: Props) => (
    <div className = 'subject-text'>
        {_isMultipleRoomsQuantity
            ? <MultipleRoomsNameDropdown />
            : <Tooltip
                content = { _subject }
                position = 'bottom'>
                <div className = 'subject-text--content'>{ _subject }</div>
            </Tooltip>
        }
    </div>
);


/**
 * Maps (parts of) the Redux state to the associated
 * {@code Subject}'s props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _subject: string,
 * }}
 */
function _mapStateToProps(state) {
    return {
        _subject: state['features/riff-platform']?.meeting?.meeting?.name,
        _isMultipleRoomsQuantity: Boolean(state['features/riff-platform']?.meeting?.meeting?.multipleRoomsQuantity)
    };
}

export default connect(_mapStateToProps)(SubjectText);
