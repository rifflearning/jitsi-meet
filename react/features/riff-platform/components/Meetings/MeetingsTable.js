import { TableRow } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import PropTypes from 'prop-types';
import React from 'react';

import MeetingRow from './MeetingRow';

const MeetingsTabele = ({ meetingsList = [], isGroup }) => (
    <Table>
        <TableBody>
            {meetingsList.map(meeting =>
                (<MeetingRow
                    isGroup = { isGroup }
                    key = { meeting._id }
                    meeting = { meeting } />)
            )}
            <TableRow />{/* prevents scrollbar in table */}
        </TableBody>
    </Table>
);

MeetingsTabele.propTypes = {
    // external prop
    isGroup: PropTypes.bool,
    meetingsList: PropTypes.array
};

export default MeetingsTabele;
