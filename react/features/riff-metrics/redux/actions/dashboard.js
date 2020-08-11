/* ******************************************************************************
 * dashboard.js                                                                 *
 * *************************************************************************/ /**
 *
 * @fileoverview Dashboard redux action creators
 *
 * [More detail about the file's contents]
 *
 * Created on       August 27, 2018
 * @author          Dan Calacci
 *
 * @copyright (c) 2018-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/


import {
    cmpObjectProp,
    computeUtterancePairwiseRelations,
    getDurationInSeconds,
    groupByPropertyValue,
    logger,
    reverseCmp
} from '../../libraries/utils';
import { app } from '../../libraries/riffdata-client';
import { riffGetRoomFromId } from '../../redux/actions/riff';
import { ActionTypes } from '../../redux/constants';
import { getIsPersonalMode } from '../../redux/selectors/config';


// Error messages thrown (and checked in catch)
const NO_USEFUL_MEETINGS_FOUND = 'no useful meetings';
const NO_MEETINGS_WITH_OTHERS_FOUND = 'no meetings with other participants';

/* ******************************************************************************
 * updateMeetingList (sync action)                                         */ /**
 *
 * Update the list of meetings that the current user attended.
 */
const updateMeetingList = meetings => {
    return {
        type: ActionTypes.DASHBOARD_FETCH_MEETINGS,
        status: 'loaded',
        meetings
    };
};

/* ******************************************************************************
 * selectMeeting (sync action)                                             */ /**
 *
 * Select the specified meeting in the dashboard's list of meetings.
 */
const selectMeeting = meeting => {
    return {
        type: ActionTypes.DASHBOARD_SELECT_MEETING,
        meeting
    };
};

/* ******************************************************************************
 * dashboardGraphLoaded (sync action)                                      */ /**
 *
 * Set the status of the specified graphType to loaded
 * This means the amcharts 'ready' callback was fired for this graph.
 *
 * @param {string} graphType - the graph type (types defined in constants/Graphs)
 */
const dashboardGraphLoaded = graphType => {
    logger.debug('Action.dashboard.dashboardGraphLoaded: graphType:', graphType);

    return {
        type: ActionTypes.DASHBOARD_GRAPH_LOADED,
        graphType
    };
};

/* ******************************************************************************
 * loadMeetingData (async action)                                          */ /**
 *
 * Returns a thunk that will asynchronously load the stats for the specified
 * meeting, along with the metrics for the specified participant in the meeting.
 *
 * @param {string} uid
 * @param {string} meetingId
 *
 * @returns {ReduxThunk} Which returns a promise which resolves when ALL the
 *      meeting stats and participant metrics have been loaded.
 */
function loadMeetingData(uid, meetingId) {
    async function thunk(dispatch /* , getState*/) {
        // Synchronously change the meeting stats, influence and timeline statuses to 'loading'
        dispatch({ type: ActionTypes.DASHBOARD_FETCH_MEETING_STATS,
            status: 'loading' });
        dispatch({ type: ActionTypes.DASHBOARD_FETCH_MEETING_TIMELINE,
            status: 'loading' });
        dispatch({ type: ActionTypes.DASHBOARD_FETCH_MEETING_INFLUENCE,
            status: 'loading' });
        dispatch({ type: ActionTypes.DASHBOARD_FETCH_MEETING_INTERRUPTIONS,
            status: 'loading' });
        dispatch({ type: ActionTypes.DASHBOARD_FETCH_MEETING_AFFIRMATIONS,
            status: 'loading' });

        // TODO: we should also synchronously change the influence and timeline fetching status to 'loading'

        const rawUtterances = await app.service('utterances')
            .find({
                query: {
                    meeting: meetingId,
                    $limit: 10000,
                    stitch: true

                    // $sort: { startTime: 1 } // requesting stitched utterances to be returned sorted does not work!
                }
            });

        const sortedUtterances = rawUtterances.slice().sort(cmpObjectProp('startTime'));
        const participantUtterances = groupByPropertyValue(sortedUtterances, 'participant');

        logger.debug('Action.dashboard.loadMeetingData: utterances:',
                     { raw: rawUtterances,
                         sorted: sortedUtterances,
                         grouped: participantUtterances });

        const speakingParticipantIds = Object.keys(participantUtterances);
        const participantsQResponse = await app.service('participants')
            .find({ query: { _id: { $in: speakingParticipantIds },
                $limit: 100 } });

        if (participantsQResponse.total > participantsQResponse.limit) {
            logger.error('Action.dashboard.loadMeetingData: Error: Too many participants '
                         + `(${participantsQResponse.total}) for query. `
                         + `Raise limit of ${participantsQResponse.limit}`);
        }
        const speakingParticipants = participantsQResponse.data
            .reduce((partMap, p) => partMap.set(p._id, { id: p._id,
                name: p.name,
                email: p.email }), new Map());

        logger.debug('Action.dashboard.loadMeetingData: speakingParticipants:',
                     { participantsQResponse,
                         speakingParticipants });

        // Asynchronously get the meeting stats, influence data and timeline data.
        // They will dispatch actions updating their fetch status to loaded when they complete.
        return Promise.all([
            getMeetingStats(participantUtterances, speakingParticipants, meetingId, dispatch),
            getInfluenceData(sortedUtterances, speakingParticipants, meetingId, uid, dispatch),
            getInterruptionsData(sortedUtterances, speakingParticipants, meetingId, uid, dispatch),
            getAffirmationsData(sortedUtterances, speakingParticipants, meetingId, uid, dispatch),
            getTimelineData(sortedUtterances, speakingParticipants, meetingId, uid, dispatch)
        ]);
    }

    return thunk;
}

/* ******************************************************************************
 * loadRecentMeetings (async action)                                       */ /**
 *
 * Returns a thunk that will asynchronously load all the meetings that the given
 * user (uid) participated in.
 *
 * @param {string} uid
 *
 * @returns {ReduxThunk} Which returns a promise which resolves when ALL the
 *      meetings have been loaded.
 */
function loadRecentMeetings(uid) {
    async function thunk(dispatch/* , getState*/) {
        // Synchronously change the fetch meetings status to 'loading'
        dispatch({ type: ActionTypes.DASHBOARD_FETCH_MEETINGS,
            status: 'loading' });

        let participant = null;

        try {
            participant = await app.service('participants').get(uid);
            logger.debug(`Action.dashboard.loadRecentMeeting: get participant ${uid}`, { participant });

            const allParticipantsMeetings = await app.service('meetings')
                .find({
                    query: {
                        _id: { $in: participant.meetings }
                    }
                });

            logger.debug(`Action.dashboard.loadRecentMeeting: meetings for participant ${uid}`,
                         { allParticipantsMeetings });

            const usefulMeetings = allParticipantsMeetings.filter(isUsefulMeeting);

            if (usefulMeetings.length === 0) {
                throw new Error(NO_USEFUL_MEETINGS_FOUND);
            }

            const promiseAddParticipantsToMeetings = usefulMeetings.map(m => addAttendingParticipantsToMeeting(m));

            await Promise.all(promiseAddParticipantsToMeetings);

            // now that we have the participants in each meeting, also exclude meetings with
            // only 1 participant.

            // TODO: this will include meetings where someone joins but does not speak.
            // because we use the utterance data to inform our shit, the # of attendees will also be wrong.
            // right thing to do here is to try and create a service on the server that will reliably give
            // us # of attendees
            logger.debug('Action.dashboard.loadRecentMeeting: usefulMeetings w/ participants', usefulMeetings);
            const meetingsWithOthers = usefulMeetings.filter(m => m.participants.size > 1);

            logger.debug('Action.dashboard.loadRecentMeeting: useful meetings (pass1 and pass2):',
                         { usefulMeetings,
                             meetingsWithOthers });

            if (meetingsWithOthers.length === 0) {
                throw new Error(NO_MEETINGS_WITH_OTHERS_FOUND);
            }

            // sort the meetings by descending time
            meetingsWithOthers.sort(reverseCmp(cmpObjectProp('startTime')));
            let finalMeetings = meetingsWithOthers;

            // if we're in personal mode, we need to replace any room ids
            // with their human readable names
            if (getIsPersonalMode()) {
                const idsToNames = await getRoomIdToNameMap(finalMeetings);
                const replaceRoomIdWithName = roomIdToName(idsToNames);

                finalMeetings = finalMeetings.map(replaceRoomIdWithName);
            }

            dispatch(updateMeetingList(finalMeetings));

            if (finalMeetings.length > 0) {
                const newSelectedMeeting = finalMeetings[0];

                dispatch(selectMeeting(newSelectedMeeting));
                dispatch(loadMeetingData(uid, newSelectedMeeting._id));
            }

            // We're done at this point, return undefined to indicate that.
            return undefined;
        } catch (e) {
            if (participant === null) {
                logger.info(`Action.dashboard.loadRecentMeeting: Error getting participant ${uid}: ${e}`);

                return dispatch({
                    type: ActionTypes.DASHBOARD_FETCH_MEETINGS,
                    status: 'error',
                    message: 'No meetings found. Meetings that last for over two minutes will show up here.'
                });
            }

            if (e.message === NO_USEFUL_MEETINGS_FOUND) {
                return dispatch({
                    type: ActionTypes.DASHBOARD_FETCH_MEETINGS,
                    status: 'error',
                    message: 'We\'ll only show meetings that lasted for over two minutes. Go have a riff!'
                });
            }

            if (e.message === NO_MEETINGS_WITH_OTHERS_FOUND) {
                return dispatch({
                    type: ActionTypes.DASHBOARD_FETCH_MEETINGS,
                    status: 'error',
                    message: 'Only had meetings by yourself? '
                             + 'Come back after some meetings with others to explore some insights.' });
            }

            logger.error(`Action.dashboard.loadRecentMeeting: Error: couldn't retrieve meetings: ${e}`, { e });

            // infinite loop? Keep trying (every 4 seconds)
            const retryHandle = setTimeout(() => dispatch(loadRecentMeetings(uid)), 4000);

            return { err: e,
                retryHandle };
        }
    }

    return thunk;
}

/* ******************************************************************************
 * getMeetingStats (async)                                                 */ /**
 *
 * Use the given list of raw utterance objects to calculate some simple stats for
 * the meeting the utterances belong to.
 * The stats are returned as an array of objects, with each object containing
 * stats for a participant in the meeting.
 * The object contains the participant id and name as well as the following
 * stats:
 *  - numUtterances - number of utterances made by the participant
 *  - lengthUtterances - sum of the duration of the participant's utterances in seconds
 *  - meanLengthUtterances - average duration of the participant's utterances in seconds.
 *
 * It is expected (but not verified in any way) that the list of utterances is all
 * of the utterance objects for the specified meeting id.
 *
 * An Utterance is defined by this mongoose schema:
 *   const utteranceSchema = new Schema({
 *       participant: { type: String, ref: 'Participant' },
 *       meeting: { type: String, ref: 'Meeting' },
 *       startTime: Date,
 *       endTime: Date,
 *       volumes: [{
 *           timestamp: String,
 *           vol: Number
 *       }]
 *   }).
 *
 * @param {Object<ParticipantId, Array<Utterance>>} participantUtterances
 * @param {Map<ParticipantId, { id: ParticipantId, name: string, email: string }>} speakingParticipants
 * @param {string} meetingId
 * @param {Function} dispatch
 *
 * @returns {Array<{ participantId: string,
 *                   name: string,
 *                   lengthUtterances: number,
 *                   numUtterances: number,
 *                   meanLengthUtterances: number }>}
 */
async function getMeetingStats(participantUtterances, speakingParticipants, meetingId, dispatch) {
    try {
        const participantStats = [];

        for (const participant of speakingParticipants.values()) {
            const utterances = participantUtterances[participant.id];
            const numUtterances = utterances.length;
            const totalSecsUtterances
                = utterances.reduce((uSecs, u) => uSecs + getDurationInSeconds(u.startTime, u.endTime), 0);
            const meanSecsUtterances = numUtterances ? totalSecsUtterances / numUtterances : 0;

            participantStats.push({
                name: participant.name,
                participantId: participant.id,
                numUtterances,
                lengthUtterances: totalSecsUtterances,
                meanLengthUtterances: meanSecsUtterances
            });
        }

        logger.debug('Action.dashboard.getMeetingStats: success', { participantStats });

        // We've successfully loaded the meeting stats
        dispatch({
            type: ActionTypes.DASHBOARD_FETCH_MEETING_STATS,
            status: 'loaded',
            meetingStats: participantStats
        });

        return participantStats;
    } catch (e) {
        logger.error('Action.dashboard.getMeetingStats: ERROR encountered', e);

        dispatch({
            type: ActionTypes.DASHBOARD_FETCH_MEETING_STATS,
            status: 'error',
            error: e
        });

        throw e;
    }
}

/* ******************************************************************************
 * getAffirmationsData (async)                                             */ /**
 *
 * Goal is to create counts of who interrupted whom.
 * A interrupts B if A begins to speak while B is speaking;
 * and A and B's speach overlaps for at least a second;
 * and A speaks for at least 5 seconds before stopping;
 * and B gives up and stops talking before A stops talking.
 *
 * @param {Array<Utterance>} sortedUtterances - Utterances sorted ascending by startTime.
 * @param {Map<ParticipantId, { id: ParticipantId, name: string, email: string }>} speakingParticipants
 *      Map of the meeting's speaking participants by id.
 * @param {string} meetingId - unused (TODO: Remove).
 * @param {string} uid - unused (TODO: remove)
 * @param {Function} dispatch
 *
 * @returns {Array<{ id: string,            - unique id for this element of the array
 *                   size: number,
 *                   source: string,        - participant Id
 *                   sourceName: string,    - participant Name
 *                   target: string,        - participant Id
 *                   targetName: string }>} - participant Name
 */
async function getAffirmationsData(sortedUtterances, speakingParticipants, meetingId, uid, dispatch) {
    dispatch({
        type: ActionTypes.DASHBOARD_FETCH_MEETING_AFFIRMATIONS,
        status: 'loading'
    });


    // If the earlier utterance ends after the later utterance starts,
    // future utterances could possibly affirm the earlier utterance.
    const keepPredicate = laterUtt => earlierUtt => {
        const timeDiff = getDurationInSeconds(earlierUtt.endTime, laterUtt.startTime);
        const keep = timeDiff < 0;

        return keep;
    };

    // Does the later utterance affirm the earlier utterance?
    const affirmationPredicate = (earlierUtt, laterUtt) => {
        if (earlierUtt.participant === laterUtt.participant) {
            return false; // can't affirm yourself
        }

        // Do they overlap for long enough?
        const sufficientOverlap = getDurationInSeconds(laterUtt.startTime, earlierUtt.endTime) > 0.25;

        // Is the interruption less than 2 seconds?
        const shortAffirmation = getDurationInSeconds(laterUtt.startTime, laterUtt.endTime) < 2;

        // Does the affirmation stop before the earlier utterance stops?
        const affirmationsEnds = getDurationInSeconds(laterUtt.endTime, earlierUtt.endTime) > 0;

        const isAffirming = sufficientOverlap && shortAffirmation && affirmationsEnds;

        return isAffirming;
    };

    const affirmationsData = computeUtterancePairwiseRelations(
        sortedUtterances,
        speakingParticipants,
        affirmationPredicate,
        keepPredicate
    );

    logger.debug('Action.dashboard.getAffirmationsData: success', { affirmationsData });

    dispatch({
        type: ActionTypes.DASHBOARD_FETCH_MEETING_AFFIRMATIONS,
        status: 'loaded',
        affirmationsData
    });

    return affirmationsData;
}

/* ******************************************************************************
 * getInterruptionsData (async)                                            */ /**
 *
 * Goal is to create counts of who interrupted whom.
 * A interrupts B if A begins to speak while B is speaking;
 * and A and B's speach overlaps for at least a second;
 * and A speaks for at least 5 seconds before stopping;
 * and B gives up and stops talking before A stops talking.
 *
 * @param {Array<Utterance>} sortedUtterances - Utterances sorted ascending by startTime.
 * @param {Map<ParticipantId, { id: ParticipantId, name: string, email: string }>} speakingParticipants
 *      Map of the meeting's speaking participants by id.
 * @param {string} meetingId - unused (TODO: Remove).
 * @param {string} uid - unused (TODO: remove)
 * @param {Function} dispatch
 *
 * @returns {Array<{ id: string,    - unique id for this element of the array
 *           size: number,
 *           source: string,        - participant Id
 *           sourceName: string,    - participant Name
 *           target: string,        - participant Id
 *           targetName: string }>} - participant Name
 */
async function getInterruptionsData(sortedUtterances, speakingParticipants, meetingId, uid, dispatch) {
    dispatch({
        type: ActionTypes.DASHBOARD_FETCH_MEETING_INTERRUPTIONS,
        status: 'loading'
    });

    // If the earlier utterance ends after the later utterance starts,
    // future utterances could possibly interrupt the earlier utterance.
    const keepPredicate = laterUtt => earlierUtt => {
        const timeDiff = getDurationInSeconds(earlierUtt.endTime, laterUtt.startTime);
        const keep = timeDiff < 0;

        return keep;
    };

    // Does the later utterance interrupt the earlier utterance?
    const interrruptionPredicate = (earlierUtt, laterUtt) => {
        if (earlierUtt.participant === laterUtt.participant) {
            return false; // can't interrupt yourself
        }

        // Do the two utterances overlap for long enough?
        const sufficientOverlap = getDurationInSeconds(laterUtt.startTime, earlierUtt.endTime) > 1;

        // Is the interruption longer than 5 seconds?
        const sufficientInterruption = getDurationInSeconds(laterUtt.startTime, laterUtt.endTime) > 5;

        // Did the interrupted person stop speaking first?
        const successfulInterruption = getDurationInSeconds(earlierUtt.endTime, laterUtt.endTime) > 0;

        return sufficientOverlap && sufficientInterruption && successfulInterruption;
    };

    const interruptionData = computeUtterancePairwiseRelations(
        sortedUtterances,
        speakingParticipants,
        interrruptionPredicate,
        keepPredicate
    );

    logger.debug('Action.dashboard.getInterruptionsData: success', { interruptionData });

    dispatch({
        type: ActionTypes.DASHBOARD_FETCH_MEETING_INTERRUPTIONS,
        status: 'loaded',
        interruptionData
    });

    return interruptionData;
}

/* ******************************************************************************
 * getInfluenceData (async)                                                */ /**
 *
 * Goal is to process and create a count of how many times each person
 * influenced each other person in a meeting.
 * A influences B when B speaks within 3 seconds of the end of something A said.
 *
 * @param {Array<Utterance>} sortedUtterances - Utterances sorted ascending by startTime.
 * @param {Map<ParticipantId, { id: ParticipantId, name: string, email: string }>} speakingParticipants
 *      Map of the meeting's speaking participants by id.
 * @param {string} meetingId - unused (TODO: Remove).
 * @param {string} uid - unused (@TODO: remove)
 * @param {Function} dispatch
 *
 * @returns {Array<{ id: string,            - unique id for this element of the array
 *                   size: number,          - count of source's influences on target
 *                   source: string,        - participant Id
 *                   sourceName: string,    - participant Name
 *                   target: string,        - participant Id
 *                   targetName: string }>} - participant Name
 */
async function getInfluenceData(sortedUtterances, speakingParticipants, meetingId, uid, dispatch) {

    // Does the earlier utterance influence the later utterance?
    const influencePredicate = (earlierUtt, laterUtt) => {
        if (earlierUtt.participant === laterUtt.participant) {
            return false; // can't influence yourself
        }

        const timeDiff = getDurationInSeconds(earlierUtt.endTime, laterUtt.startTime);
        const recent = timeDiff < 3 && timeDiff > 0;

        return recent;
    };

    // If the earlier utterance might be influenced by the later utterance OR any
    // utterance after that one, return true so that the earlier utterance will be
    // tested against the later utterance and those that come after it.
    //
    // If the end of an earlier utterance is within 3 seconds of the start of a later utterance,
    // the earlier utterance could possibly influence that utterance and one's after that.
    const keepPredicate = laterUtt => earlierUtt => {
        const timeDiff = getDurationInSeconds(earlierUtt.endTime, laterUtt.startTime);
        const keep = timeDiff < 3;

        return keep;
    };

    const influenceData = computeUtterancePairwiseRelations(
        sortedUtterances,
        speakingParticipants,
        influencePredicate,
        keepPredicate
    );

    logger.debug('Action.dashboard.getInfluenceData: success', { influenceData });

    dispatch({
        type: ActionTypes.DASHBOARD_FETCH_MEETING_INFLUENCE,
        status: 'loaded',
        influenceData
    });

    return influenceData;
}

/* ******************************************************************************
 * getTimelineData (async)                                                 */ /**
 *
 * Get all the data needed to display the timeline of participants talking
 * for a particular meeting.
 *
 * @param {Array<Utterance>} sortedUtterances - Utterances sorted ascending by startTime.
 * @param {Map<ParticipantId, { id: ParticipantId, name: string, email: string }>} speakingParticipants
 *      - Map of the meeting's speaking participants by id.
 * @param {string} meetingId - Unused.
 * @param {string} uid - Participant Id of the current user.
 * @param {Function} dispatch
 *
 * @returns {{ sortedParticipants: Array,
 *             utts: Array,
 *             startTime: string, - Date string ex. 2019-03-07T19:13:07.345Z
 *             endTime: string }}
 */
async function getTimelineData(sortedUtterances, speakingParticipants, meetingId, uid, dispatch) {
    // sortedUtterances are sorted by startTime, so the minStartTime is the startTime of the 1st one

    const firstUtt = sortedUtterances[0];

    const minStartTime = firstUtt ? firstUtt.startTime : null;
    const maxEndTime = sortedUtterances.reduce((maxTime, curUtt) => curUtt.endTime > maxTime ? curUtt.endTime : maxTime, '2000-01-01T00:00:00.000Z');

    // extract the utterance properties we care about (convert time strings to Date objects)
    const utts = sortedUtterances.map(u => {
        return {
            participant: u.participant,
            startDate: new Date(u.startTime),
            endDate: new Date(u.endTime)
        };
    });

    // sort the participants into the order they should be displayed in the chart
    // putting current user first
    // Note: we are referencing the objects stored in speakingParticipants, except for
    //       the current user's, because we need to modify that one.
    //       No one else should modify these participant objects!
    const sortedParticipants = [];

    for (const p of speakingParticipants.values()) {
        if (p.id !== uid) {
            sortedParticipants.push(p);
        }
    }

    sortedParticipants.sort(cmpObjectProp('id'));
    sortedParticipants.unshift({ ...speakingParticipants.get(uid),
        name: 'You' });

    const timelineData = {
        utts,
        sortedParticipants,
        sortedUtterances,
        startTime: minStartTime,
        endTime: maxEndTime
    };

    logger.debug('Action.dashboard.getTimelineData: success', { timelineData });

    dispatch({
        type: ActionTypes.DASHBOARD_FETCH_MEETING_TIMELINE,
        status: 'loaded',
        timelineData
    });

    return timelineData;
}

/* ******************************************************************************
 * isUsefulMeeting                                                         */ /**
 *
 * Return true if the meeting was a "useful" meeting.
 */
function isUsefulMeeting(meeting) {
    //  any meeting "in progress" is useful
    if (!meeting.endTime) {
        return true;
    }

    // meetings longer than 2 minutes are useful
    const durationSecs = getDurationInSeconds(meeting.startTime, meeting.endTime);

    return durationSecs > 2 * 60;
}

/* ******************************************************************************
 * addAttendingParticipantsToMeeting                                       */ /**
 *
 * [Description of addAttendingParticipantsToMeeting].
 *
 * @param {string} meeting
 *      - [Description of the meeting parameter].
 *
 * @returns {string}
 */
async function addAttendingParticipantsToMeeting(meeting) {
    const participantEventsQResponse = await app.service('participantEvents')
        .find({ query: { meeting: meeting._id,
            $limit: 500 } });

    // use the participant events to find all participants in
    // that meeting, and add that set of participants to the meeting object
    const participantEvents = participantEventsQResponse.data;
    const participantIdsInEvents = participantEvents.flatMap(pe => pe.participants);

    meeting.participants = new Set(participantIdsInEvents); // eslint-disable-line require-atomic-updates

    return meeting;
}

/* ******************************************************************************
 * getRoomIdToNameMap                                                      */ /**
 *
 * Given a list of meetings, return a map of the meeting room ids to
 * room names. To be used to convert the ids to their human readable form
 * when in personal mode.
 *
 */
async function getRoomIdToNameMap(meetings) {
    const idsToNames = {};

    for (const mtg of meetings) {
        if (!Object.prototype.hasOwnProperty.call(idsToNames, mtg.room)) {
            const riffRoom = await riffGetRoomFromId(mtg.room);

            if (riffRoom) {
                idsToNames[mtg.room] = riffRoom.title;
            }
        }
    }

    return idsToNames;
}

/* ******************************************************************************
 * roomIdToName                                                            */ /**
 * Returns a function to be used to map meetings with room ids
 * to meetings with room names. Takes a object mapping ids to names and
 * closes over it to provide a function to pass to `map`.
 *
 * If the mapping doesn't have a meeting's room id, we just ignore it. This
 * should only occur in instances where we have a database with data from
 * mixed deployments (ie personal and teams modes), which should only
 * happen in test environments.
 */
function roomIdToName(idsToNames) {
    return mtg => {
        if (Object.prototype.hasOwnProperty.call(idsToNames, mtg.room)) {
            return { ...mtg,
                room: idsToNames[mtg.room] };
        }

        return mtg;
    };
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {

    // Dashboard action creators
    updateMeetingList,
    selectMeeting,
    loadMeetingData,
    loadRecentMeetings,
    dashboardGraphLoaded
};
