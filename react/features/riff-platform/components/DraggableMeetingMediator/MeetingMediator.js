/* eslint-disable require-jsdoc */
/* eslint-disable react/jsx-sort-props */
/* eslint-disable react/jsx-tag-spacing */
/* ******************************************************************************
 * MeetingMediator.js                                                          *
 * *************************************************************************/ /**
 *
 * @fileoverview The Meeting Mediator
 *
 * NOTE - I didn't change this much in the course of the refactor
 * too many moving parts -jr 6.19.19
 *
 * Created on       August 21, 2018
 * @author          Dan Calacci
 * @author          Jordan Reedie
 * @author          Michael Jay Lippert
 * @author          Ari Rizzitano
 *
 * @copyright (c) 2018-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/
import { A11y, ChartCard } from '@rifflearning/riff-metrics';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { maybeExtractIdFromDisplayName } from '../../../riff-dashboard-page/functions';
import Mediator from '../../libs/charts';
import { app } from '../../libs/riffdata-client';

/**
  *  Chart configuration properties
  */
const chartConfig = {
    cardTitle: 'Meeting Mediator',
    info: 'The Meeting Mediator provides real-time feedback about the last five '
           + 'minutes of your conversation. Thick lines and proximity to the central '
           + 'node indicate conversational dominance. Hover over a node to see how '
           + 'much a person has spoken. The center node displays the number of '
           + 'exchanges between participants. A higher number represents a more '
           + 'energetic conversation.'
};

class MeetingMediator extends React.Component {
     static propTypes = {
         /** ID of the current user */
         displayName: PropTypes.string.isRequired,

         /** display name of the current user */
         isEnabled: PropTypes.bool.isRequired,

         /** List of participant IDs in the meeting */
         riffParticipants: PropTypes.arrayOf(PropTypes.string).isRequired,

         /** Unique "room" name supplied to webrtc to connect the users in the meeting */
         uid: PropTypes.string.isRequired,

         /** Should the mediator be displayed? */
         webRtcPeers: PropTypes.array.isRequired,

         /** List of other participants in the meeting */
         webRtcRoom: PropTypes.string.isRequired
     };

     constructor(props) {
         super(props);
         this.state = {
             tableRows: [],
             caption: null
         };
         this.namesById = this.getNamesById();
         this.updateAccessibleTable = this.updateAccessibleTable.bind(this);
     }

     componentDidMount() {
         this.startMM();
     }

     componentDidUpdate(prevProps) {
         if (prevProps.webRtcPeers !== this.props.webRtcPeers
             || prevProps.uid !== this.props.uid
             || prevProps.displayName !== this.props.displayName
         ) {
             this.namesById = this.getNamesById();
         }

         if (this.mm) {
             this.mm.update_users(this.props.riffParticipants, this.namesById);
         }
     }

     getNamesById() {
         const namesById = this.props.webRtcPeers.reduce((memo, p) => {
             const data = p.nick.split('|');

             memo[data[0]] = data[1];

             return memo;
         }, {});

         namesById[this.props.uid] = this.props.displayName;

         return namesById;
     }

     updateAccessibleTable(data) {
         this.setState({
             tableRows: data.turns.map(turn => [
                 this.namesById[turn.participant],
                 [ `${Math.round(turn.turns * 100)}%` ]
             ]),
             caption: `Turns taken: The group has taken ${data.transitions} turns `
                      + 'between participants in the last five minutes.'
         });
     }

     startMM() {
         this.mm = new Mediator(
             app,
             this.props.riffParticipants,
             this.props.uid,
             this.props.webRtcRoom,
             this.props.displayName,
             this.updateAccessibleTable,
             this.namesById
         );
     }

     render() {
         // if it's not enabled we just return `null`, which tells react
         // not to render anything
         if (!this.props.isEnabled) {
             return null;
         }

         const chartTable = this.state.tableRows.length ? (
             <A11y.ChartTable
                 cols = { [ 'Participant', 'Amount of Speaking' ] }
                 rows = { this.state.tableRows }
                 caption = { this.state.caption }/>
         ) : null;

         const chartDiv = <div id = 'meeting-mediator'/>;

         return (
             <div>
                 <ChartCard
                     title = { chartConfig.cardTitle }
                     chartInfo = { chartConfig.info }
                     chartDiv = { chartDiv }
                     chartCardId = 'meeting-mediator-card'
                     longDescription = { true }>
                     {chartTable}
                     {chartDiv}
                 </ChartCard>
             </div>
         );
     }
}

const mapStateToProps = state => {
    return {
        uid: state['features/riff-platform'].signIn.user?.uid, // getUserId(state),
        riffParticipants: state['features/base/participants'].map((p, i) => {
            if (i === 0) {
                return state['features/riff-platform'].signIn.user?.uid;
            }

            return maybeExtractIdFromDisplayName(p.name).firebaseId;
        }),
        webRtcRoom: state['features/riff-platform'].meeting.meeting?.roomId
    };
};

const ConnectedMeetingMediator = connect(mapStateToProps)(MeetingMediator);

/* **************************************************************************** *
  * Module exports                                                               *
  * **************************************************************************** */
export {
    ConnectedMeetingMediator as MeetingMediator
};
