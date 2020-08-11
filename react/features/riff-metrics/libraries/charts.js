/* ******************************************************************************
 * charts.js                                                                    *
 * *************************************************************************/ /**
 *
 * @fileoverview Meeting mediator wrapper which listens to events for updates
 *
 * [More detail about the file's contents]
 *
 * Created on        August 7, 2017
 * @author           Jordan Reedie
 *
 * @copyright (c) 2018-present Riff Learning, Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

// I'm not attempting to rename all the identifiers in this file at this time, instead
// I'm just turning off the camelcase check. -mjl 2019-06-18
/* eslint
    camelcase: off,
 */

import { logger } from './utils';

import mediator from './mm.coffee';

const MM = mediator.MeetingMediator;

class Mediator {
    // COPIED FROM ORIGINAL RHYTHM-RTC PROJECT
    // with some minor modifications

    constructor(app, participants, user, roomName, userName, updateAccessibleTable, namesById) {
        logger.debug('Mediator initial state:', participants, user, roomName, userName);

        this.mm = null;
        this.mm_width = 200;
        this.mm_height = 200;
        this.app = app;
        this.user = user;
        this.roomName = roomName;
        this.roomUsers = participants;
        this.userName = userName;
        this.updateAccessibleTable = updateAccessibleTable;
        this.namesById = namesById;

        // if (!elementIsEmpty('#meeting-mediator')) {
        //   logger.debug('not starting a second MM...');
        //   return;
        // }

        this.turns = this.app.service('turns');
        logger.debug('>> Starting meeting mediator...');
        logger.debug('MM participants:', this.roomUsers);
        logger.debug('meeting mediator:', MM);
        this.mm = new MM(
            {
                participants: this.roomUsers,
                transitions: 0,
                turns: [],
                names: this.namesById
            },
            [ this.user ],
            this.mm_width,
            this.mm_height,
        );
        this.mm.render('#meeting-mediator');

        this.maybe_update_mm_turns = this.maybe_update_mm_turns.bind(this);
        this.turns.on('updated', this.maybe_update_mm_turns);

        this.handle_participantEvent_created = this.handle_participantEvent_created.bind(this);
        // logger.debug('starting listening for participants');
        // this.app.service('participantEvents').on('created', this.handle_participantEvent_created);

        this.start_meeting_listener();
    }

    // just sums up values of the turns object.
    get_total_transitions(turns) {
        return Object.values(turns).reduce((total, curval) => total + curval, 0);
    }

    // transform to the right data to send to chart
    transform_turns(participants, turns) {
        logger.debug('transforming turns:', turns);
        logger.debug('participants: ', participants);
        // filter out turns not by present participants
        const filtered_turns = turns.filter(turn => participants.includes(turn.participant));
        return filtered_turns;
    }

    // update MM turns if it matches this hangout.
    //
    // example:
    //   data:
    //     participants:
    //       - "Mike"
    //       - "Beth"
    //     transitions: 2
    //     turns:
    //       -
    //         _id: "5b183d0d1af76300111c871d"
    //         participant: "Beth"
    //         turns: 0.5294117647058824
    //       -
    //         _id: "5b183d0d1af76300111c871c"
    //         participant: "Mike"
    //         turns: 0.47058823529411764
    maybe_update_mm_turns(data) {
        logger.debug('mm data turns:', data);

        if (data.room === this.roomName && this.mm.data.participants.length > 1) {
            const mmdata = {
                participants: this.roomUsers,
                transitions: data.transitions,
                turns: this.transform_turns(this.roomUsers, data.turns),
                names: this.namesById,
            };
            this.updateAccessibleTable(mmdata);
            this.mm.updateData(mmdata);
        }
        else {
            // wrong room, or not enough participants
            // logger.debug('charts.maybe_update_mm_turns: wrong room, or not enough participants',
            //              { room: data.room,
            //                expectedRoom: this.roomName,
            //                NumParticipants: this.mm.data.participants.length });
        }
    }

    // update MM participants if it matches this hangout.
    // removes the local participants from the list.
    maybe_update_mm_participants() {
        logger.debug('charts.maybe_update_mm_participants:...');
        // if there's only one person in the room, we want the ball to be at the center.
        // i think this should be handled by the viz code, but it's not and i
        // don't really want to modify it
        const newTurns = this.roomUsers.length > 1 ? this.mm.data.turns : [];
        this.mm.updateData({
            participants: this.roomUsers,
            transitions: this.mm.data.transitions,
            turns: newTurns,
            names: this.namesById,
        });
    }

    update_users(users, namesById) {
        logger.debug('charts.update_users:', { oldUsers: this.roomUsers, newUsers: users });
        this.roomUsers = users;
        this.namesById = namesById;
        this.maybe_update_mm_participants();
    }

    handle_participantEvent_created(obj) {
        logger.debug('got a new participant event:', obj);
        logger.debug(`roomname: ${this.roomName}`);
        if (obj.room === this.roomName) {
            this.mm.updateData({
                participants: obj.participants,
                transitions: this.mm.data.transitions,
                turns: this.mm.data.turns,
                names: this.namesById,
            });
        }
    }

    start_meeting_listener() {
        logger.debug('starting to listen for meeting changes');
        const meetings = this.app.service('meetings');
        meetings.on('patched', (obj) => {
            logger.debug('meeting got updated:', obj);
            logger.debug(`roomname: ${this.roomName}`);
            if (obj.room === this.roomName) {
                logger.debug('room matches... updating meeting mediator');
                this.mm.updateData({
                    participants: this.roomUsers,
                    transitions: this.mm.data.transitions,
                    turns: this.mm.data.turns,
                    names: this.namesById,
                });
            }
        });
    }

}

// Let's keep this function around for the time being. -mjl 2019-06-18
// eslint-disable-next-line no-unused-vars
function elementIsEmpty(selector) {
    const element = document.querySelector(selector);
    if (element === null) {
        throw new Error(`selector: '${selector}' did not reference any element in the document`);
    }

    return element.childElementCount === 0;
}

export default Mediator;
