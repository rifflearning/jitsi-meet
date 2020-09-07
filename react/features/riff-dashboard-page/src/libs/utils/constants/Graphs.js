/* ******************************************************************************
 * Graphs.js                                                                    *
 * *************************************************************************/ /**
 *
 * @fileoverview constants relating to graphs in the dashboard
 *
 * Created on       October 23, 2019
 * @author          Brec Hanson
 *
 * @copyright (c) 2019-present Riff Learning, Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { Colors, formatDuration, getColorForSelf } from 'libs/utils';

/**
 * identifiers for datasets that are used on the dashboard
 */
const GraphDatasetTypes = {
    INFLUENCES: 'influences',
    INTERRUPTIONS: 'interruptions',
    AFFIRMATIONS: 'affirmations',
    UTTERANCE_TIMELINE: 'utterance_timeline',
    MEETINGS: 'meetings',
    MEETING_STATS: 'meeting_stats',
};

/**
 * identifiers for graph types on the dashboard
 * graph types can share the same graph dataset defined in GraphDatasetTypes
 */
const GraphTypes = {
    MY_INFLUENCE: 'my_influence',
    THEIR_INFLUENCE: 'their_influence',
    MY_INTERRUPTIONS: 'my_interruptions',
    THEIR_INTERRUPTIONS: 'their_interruptions',
    MY_AFFIRMATIONS: 'my_affirmations',
    THEIR_AFFIRMATIONS: 'their_affirmations',
    GROUPED_AFFIRMATIONS: 'grouped_affirmations',
    GROUPED_INFLUENCES: 'grouped_influences',
    GROUPED_INTERRUPTIONS: 'grouped_interruptions',
    TIMELINE: 'timeline',
    SPEAKING_TIME: 'speaking_time',
    PARTICIPANT_SCORE: 'participant_score',
};

/**
 * Stores a configuration object for different graph types.
 *
 * The following properties are possible, but not present in all configs:
 *
 *  title                - The title of the chart
 *  info                 - The text displayed by the info button of the chart card containing the chart
 *  empty                - The text displayed in place of a chart when there is no data to create a chart
 *  eventsFilter         - returns a function which takes an array of events and a user id. The function
 *                         returns a filtered array of events for the graph
 *  getSourceParticipant - returns the participant that initiated an event
 *  getTargetParticipant - returns the participant that the event happened to
 *  getEventTime         - returns the time that an event took place at
 *                         ex. if an utterance is deemed an influence event, then the end time of
 *                         the utterance is the time of the influence event
 *  getTooltip           - returns a generic tooltip for the graph type
 *  getTimelineTooltip   - returns a tooltip for the graph type when it's embedded in the timeline
 *  whatIsCounted        - for each graph type, what action or event are we keeping track of
 *  legendLabel          - returns a legend label for a graph type
 *  color                - returns a color for graph parts and labels for a graph type
 *
 */
const GraphConfigs = {
    [GraphTypes.MY_INFLUENCE]: {
        title: 'Who You Influenced',
        info: 'This graph shows how many times each person spoke first after you finished speaking. ' +
              'Frequent first-responses indicate that a person is engaged by what you have to say.',
        empty: 'It doesn\'t look like anyone responded to you quickly in this meeting.',
        eventsFilter: (events, uid) => {
            return events.filter((event) => {
                return event.earlierUtt.utt.participant === uid;
            }).map((event) => {
                return event.earlierUtt;
            });
        },
        getSourceParticipant(/* event */) { return 'You'; },
        getTargetParticipant(event) { return event.otherParticipantName; },
        getEventTime(event) { return event.utt.endTime; },
        getTooltip() {
            return 'You influenced {participant}: {valueY}';
        },
        getTimelineTooltip({ target, eventTime }) {
            return `You influenced ${target} at: ${eventTime}`;
        },
        whatIsCounted: 'Influences',
        legendLabel: 'Your Influences',
        color: getColorForSelf(),
        datasetType: GraphDatasetTypes.INFLUENCES,
    },

    [GraphTypes.THEIR_INFLUENCE]: {
        title: 'Who Influenced You',
        info: 'This graph shows how many times you spoke first after another person finished speaking. ' +
              'Frequent first-responses indicate that you are engaged by what another person is saying.',
        empty: 'It doesn\'t look like you responded quickly to anyone in this meeting.',
        eventsFilter: (events, uid) => {
            return events.filter((event) => {
                return event.laterUtt.utt.participant === uid;
            }).map((event) => {
                return event.laterUtt;
            });
        },
        getSourceParticipant(event) { return event.otherParticipantName; },
        getTargetParticipant(/* event */) { return 'You'; },
        getEventTime(event) { return event.otherUtt.endTime; },
        getTooltip() {
            return '{participant} influenced you: {valueY}';
        },
        getTimelineTooltip({ source, eventTime }) {
            return `${source} influenced you at: ${eventTime}`;
        },
        whatIsCounted: 'Influences',
        legendLabel: 'Their Influences',
        color: Colors.deepBlush,
        datasetType: GraphDatasetTypes.INFLUENCES,
    },

    [GraphTypes.MY_INTERRUPTIONS]: {
        title: 'Who You Interrupted',
        info: 'This metric shows how many times you interrupted another person. Interruptions indicate ' +
              'dominance over the other speaker, and are not common on high-functioning teams.',
        empty: 'It doesn\'t look like you interrupted anyone in this meeting.',
        eventsFilter: (events, uid) => {
            return events.filter((event) => {
                return event.laterUtt.utt.participant === uid;
            }).map((event) => {
                return event.laterUtt;
            });
        },
        getSourceParticipant(/* event */) { return 'You'; },
        getTargetParticipant(event) { return event.otherParticipantName; },
        getEventTime(event) { return event.utt.startTime; },
        getTooltip() {
            return 'You interrupted {participant}: {valueY}';
        },
        getTimelineTooltip({ target, eventTime }) {
            return `You interrupted ${target} at: ${eventTime}`;
        },
        whatIsCounted: 'Interruptions',
        legendLabel: 'Your Interruptions',
        color: getColorForSelf(),
        datasetType: GraphDatasetTypes.INTERRUPTIONS,
    },

    [GraphTypes.THEIR_INTERRUPTIONS]: {
        title: 'Who Interrupted You',
        info: 'This metric shows how many times you were interrupted. Interruptions indicate ' +
              'dominance over the other speaker, and are not common on high-functioning teams.',
        empty: 'It doesn\'t look like you were interrupted by anyone in this meeting.',
        eventsFilter: (events, uid) => {
            return events.filter((event) => {
                return event.earlierUtt.utt.participant === uid;
            }).map((event) => {
                return event.earlierUtt;
            });
        },
        getSourceParticipant(event) { return event.otherParticipantName; },
        getTargetParticipant(/* event */) { return 'You'; },
        getEventTime(event) { return event.otherUtt.startTime; },
        getTooltip() {
            return '{participant} interrupted you: {valueY}';
        },
        getTimelineTooltip({ source, eventTime }) {
            return `${source} interrupted you at: ${eventTime}`;
        },
        whatIsCounted: 'Interruptions',
        legendLabel: 'Their Interruptions',
        color: Colors.deepBlush,
        datasetType: GraphDatasetTypes.INTERRUPTIONS,
    },

    [GraphTypes.MY_AFFIRMATIONS]: {
        title: 'Who You Affirmed',
        info: 'TBD\n\n' +
              'TBD',
        empty: 'TBD',
        legendLabel: 'Your Affirmations',
        whatIsCounted: 'Affirmations',
        color: getColorForSelf(),
        eventsFilter: (events, uid) => {
            return events.filter((event) => {
                return event.laterUtt.utt.participant === uid;
            }).map((event) => {
                return event.laterUtt;
            });
        },
        getSourceParticipant(/* event */) { return 'You'; },
        getTargetParticipant(event) { return event.otherParticipantName; },
        getEventTime(event) { return event.utt.startTime; },
        getTooltip() {
            return 'You affirmed {participant}: {valueY}';
        },
        getTimelineTooltip({ target, eventTime }) {
            return `You affirmed ${target} at: ${eventTime}`;
        },
        datasetType: GraphDatasetTypes.AFFIRMATIONS,
    },

    [GraphTypes.THEIR_AFFIRMATIONS]: {
        title: 'Who Affirmed You',
        info: 'TBD\n\n' +
              'TBD',
        empty: 'TBD',
        legendLabel: 'Their Affirmations',
        whatIsCounted: 'Affirmations',
        relationshipType: 'Their Affirmations',
        color: Colors.deepBlush,
        eventsFilter: (events, uid) => {
            return events.filter((event) => {
                return event.earlierUtt.utt.participant === uid;
            }).map((event) => {
                return event.earlierUtt;
            });
        },
        getSourceParticipant(event) { return event.otherParticipantName; },
        getTargetParticipant(/* event */) { return 'You'; },
        getEventTime(event) { return event.otherUtt.startTime; },
        getTooltip() {
            return '{participant} affirmed you: {valueY}';
        },
        getTimelineTooltip({ source, eventTime }) {
            return `${source} affirmed you at: ${eventTime}`;
        },
        datasetType: GraphDatasetTypes.AFFIRMATIONS,
    },

    [GraphTypes.GROUPED_AFFIRMATIONS]: {
        title: 'Affirmations',
        info: 'Affirmations represent short, confirming feedback to the speaker. They typically ' +
              'reinforce what the speaker is saying without taking over the conversation.',
        empty: 'It doesn\'t look like you affirmed anyone or anyone affirmed you in this meeting.',
        whatIsCounted: 'Affirmations',
        datasetType: GraphDatasetTypes.AFFIRMATIONS,
    },

    [GraphTypes.GROUPED_INFLUENCES]: {
        title: 'Influences',
        info: 'Influence occurs when someone responds quickly to what you\'ve said ' +
              '(you\'ve influenced them), or you respond quickly to someone else (they\'ve ' +
              'influenced you). Frequent first-responses indicate that a person is engaged by ' +
              'what the speaker said.',
        empty: 'It doesn\'t look like you influenced anyone or anyone influenced you in this meeting.',
        whatIsCounted: 'Influences',
        datasetType: GraphDatasetTypes.INFLUENCES,
    },

    [GraphTypes.GROUPED_INTERRUPTIONS]: {
        title: 'Interruptions',
        info: 'Interruptions occur when a person begins talking over the speaker, and takes ' +
              'over the conversation. Frequent interruptions can mean different things, in ' +
              'different contexts. When interruptions occur in a highly engaged group and stay ' +
              'on topic, they are likely to be perceived as positive. If they abruptly change ' +
              'the subject, or occur in a slower-paced discussion, they are likely to be perceived ' +
              'as rude or disrespectful. If your team is having a lot of interruptions, consider ' +
              'checking in to see how they are perceived.',
        empty: 'It doesn\'t look like you interrupted anyone or anyone interrupted you in this meeting.',
        whatIsCounted: 'Interruptions',
        datasetType: GraphDatasetTypes.INTERRUPTIONS,
    },

    [GraphTypes.TIMELINE]: {
        title: 'Timeline',
        info: 'This chart shows the details of meeting activity, including speaking, ' +
              'influence, affirmation, and interruption events.\n\n' +
              'Interruptions occur when a person begins talking over the speaker, and ' +
              'takes over the conversation. Frequent interruptions can mean different ' +
              'things, in different contexts. When interruptions occur in a highly engaged ' +
              'group and stay on topic, they are likely to be perceived as positive. ' +
              'If they abruptly change the subject, or occur in a slower-paced discussion, ' +
              'they are likely to be perceived as rude or disrespectful. If your team is ' +
              'having a lot of interruptions, consider checking in to see how they are ' +
              'perceived.\n\n' +
              'Affirmations represent short, confirming feedback to the speaker. They typically ' +
              'reinforce what the speaker is saying without taking over the conversation.\n\n' +
              'Influence occurs when someone responds quickly to what you\'ve said ' +
              '(you\'ve influenced them), or you respond quickly to someone else (they\'ve ' +
              'influenced you). Frequent first-responses indicate that a person is engaged ' +
              'by what the speaker said.',
        empty: 'It doesn\'t look like anyone said anything during this meeting.',
    },

    [GraphTypes.SPEAKING_TIME]: {
        title: 'Speaking Time',
        info: 'This shows a breakdown of how long each member of your meeting spoke for. More ' +
              'equal speaking time across all members is associated with higher creativity, ' +
              'more trust between group members, and better brainstorming.',
        empty: 'It doesn\'t look like anyone said anything during this meeting.',
        getTooltip(config) {
            const formattedDuration = formatDuration(config.lengthUtterances);

            const tooltip = `${config.participant}: ${formattedDuration}`;
            return tooltip;
        },
        datasetType: GraphDatasetTypes.MEETING_STATS,
    },

    [GraphTypes.PARTICIPANT_SCORE]: {
        title: 'Participant Score',
        info: 'Your participation score is a summary of how effectively you interacted with ' +
              'other meeting participants. This is a beta feature, please rate your own ' +
              'participation in the post-meeting survey.\n' +
              'Your feedback helps us improve our measurements.',
        empty: 'It doesn\'t look like there is enough data for this meeting.',
    },
};

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    GraphTypes,
    GraphConfigs,
    GraphDatasetTypes,
};
