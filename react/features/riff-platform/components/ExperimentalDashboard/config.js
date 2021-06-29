/* eslint-disable valid-jsdoc */
/* ******************************************************************************
 * config.ts                                                                    *
 * *************************************************************************/ /**
 *
 * @fileoverview constants relating to the metric graphs
 *
 * Created on       October 23, 2019
 * @author          Brec Hanson
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2019-present Riff Analytics,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import {
    Colors,
    getColorForSelf
} from './colorHelper';

/**
 * identifiers for datasets that are used on the dashboard
 */
const GraphDatasetTypes = {
    INFLUENCES: 'influences',
    INTERRUPTIONS: 'interruptions',
    AFFIRMATIONS: 'affirmations',
    UTTERANCE_TIMELINE: 'utterance_timeline',
    MEETINGS: 'meetings',
    MEETING_STATS: 'meeting_stats'
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
    PARTICIPANT_SCORE: 'participant_score'
};

/**
 * identifiers for event types that extract particular types of events from a
 * graph dataset, such as the influences of a particular participant from the
 * INFLUENCE dataset.
 */
const EventTypes = {
    MY_INFLUENCE: 'my_influence',
    THEIR_INFLUENCE: 'their_influence',
    MY_INTERRUPTIONS: 'my_interruptions',
    THEIR_INTERRUPTIONS: 'their_interruptions',
    MY_AFFIRMATIONS: 'my_affirmations',
    THEIR_AFFIRMATIONS: 'their_affirmations'
};


/**
  * Stores a configuration object for different graph types.
  */
const GraphConfigs = {
    [GraphTypes.MY_INFLUENCE]: {
        title: 'Who You Influenced',
        info: 'This graph shows how many times each person spoke first after you finished speaking. '
               + 'Frequent first-responses indicate that a person is engaged by what you have to say.',
        empty: 'It doesn\'t look like anyone responded to you quickly in this meeting.'
    },

    [GraphTypes.THEIR_INFLUENCE]: {
        title: 'Who Influenced You',
        info: 'This graph shows how many times you spoke first after another person finished speaking. '
               + 'Frequent first-responses indicate that you are engaged by what another person is saying.',
        empty: 'It doesn\'t look like you responded quickly to anyone in this meeting.'
    },

    [GraphTypes.MY_INTERRUPTIONS]: {
        title: 'Who You Interrupted',
        info: 'This metric shows how many times you interrupted another person. Interruptions indicate '
               + 'dominance over the other speaker, and are not common on high-functioning teams.',
        empty: 'It doesn\'t look like you interrupted anyone in this meeting.'
    },

    [GraphTypes.THEIR_INTERRUPTIONS]: {
        title: 'Who Interrupted You',
        info: 'This metric shows how many times you were interrupted. Interruptions indicate '
               + 'dominance over the other speaker, and are not common on high-functioning teams.',
        empty: 'It doesn\'t look like you were interrupted by anyone in this meeting.'
    },

    [GraphTypes.MY_AFFIRMATIONS]: {
        title: 'Who You Affirmed',
        info: 'TBD\n\n'
               + 'TBD',
        empty: 'TBD'
    },

    [GraphTypes.THEIR_AFFIRMATIONS]: {
        title: 'Who Affirmed You',
        info: 'TBD\n\n'
               + 'TBD',
        empty: 'TBD'
    },

    [GraphTypes.GROUPED_AFFIRMATIONS]: {
        title: 'Affirmations',
        info: 'Affirmations represent short, confirming feedback to the speaker. They typically '
               + 'reinforce what the speaker is saying without taking over the conversation.',
        empty: 'It doesn\'t look like you affirmed anyone or anyone affirmed you in this meeting.'
    },

    [GraphTypes.GROUPED_INFLUENCES]: {
        title: 'Influences',
        info: 'Influence occurs when someone responds quickly to what you\'ve said '
               + '(you\'ve influenced them), or you respond quickly to someone else (they\'ve '
               + 'influenced you). Frequent first-responses indicate that a person is engaged by '
               + 'what the speaker said.',
        empty: 'It doesn\'t look like you influenced anyone or anyone influenced you in this meeting.'
    },

    [GraphTypes.GROUPED_INTERRUPTIONS]: {
        title: 'Interruptions',
        info: 'Interruptions occur when a person begins talking over the speaker, and takes '
               + 'over the conversation. Frequent interruptions can mean different things, in '
               + 'different contexts. When interruptions occur in a highly engaged group and stay '
               + 'on topic, they are likely to be perceived as positive. If they abruptly change '
               + 'the subject, or occur in a slower-paced discussion, they are likely to be perceived '
               + 'as rude or disrespectful. If your team is having a lot of interruptions, consider '
               + 'checking in to see how they are perceived.',
        empty: 'It doesn\'t look like you interrupted anyone or anyone interrupted you in this meeting.'
    },

    [GraphTypes.TIMELINE]: {
        title: 'Timeline',
        info: 'This chart shows the details of meeting activity, including speaking, '
               + 'influence, affirmation, and interruption events.\n\n'
               + 'Interruptions occur when a person begins talking over the speaker, and '
               + 'takes over the conversation. Frequent interruptions can mean different '
               + 'things, in different contexts. When interruptions occur in a highly engaged '
               + 'group and stay on topic, they are likely to be perceived as positive. '
               + 'If they abruptly change the subject, or occur in a slower-paced discussion, '
               + 'they are likely to be perceived as rude or disrespectful. If your team is '
               + 'having a lot of interruptions, consider checking in to see how they are '
               + 'perceived.\n\n'
               + 'Affirmations represent short, confirming feedback to the speaker. They typically '
               + 'reinforce what the speaker is saying without taking over the conversation.\n\n'
               + 'Influence occurs when someone responds quickly to what you\'ve said '
               + '(you\'ve influenced them), or you respond quickly to someone else (they\'ve '
               + 'influenced you). Frequent first-responses indicate that a person is engaged '
               + 'by what the speaker said.',
        empty: 'It doesn\'t look like anyone said anything during this meeting.',
        overlayEventTypes: [
            EventTypes.MY_INTERRUPTIONS,
            EventTypes.THEIR_INTERRUPTIONS,
            EventTypes.MY_AFFIRMATIONS,
            EventTypes.THEIR_AFFIRMATIONS,
            EventTypes.MY_INFLUENCE,
            EventTypes.THEIR_INFLUENCE
        ]
    },

    [GraphTypes.SPEAKING_TIME]: {
        title: 'Speaking Time',
        info: 'This shows a breakdown of how long each member of your meeting spoke for. More '
               + 'equal speaking time across all members is associated with higher creativity, '
               + 'more trust between group members, and better brainstorming.',
        empty: 'It doesn\'t look like anyone said anything during this meeting.'
    }
};


/**
  * GetEventCountsFn.
  *
  * Returns a function that extracts event counts from relation counts for a given
  * participant on the specified side of the relation (key1 or key2).
  */
function getEventCountsFn(uidKey) {
    const otherKey = uidKey === 'key1' ? 'key2' : 'key1';

    return (allRelationCounts, uid) => {
        const eventCounts = [];

        for (const relationCount of allRelationCounts.values()) {
            if (relationCount[uidKey] !== uid) {
                // eslint-disable-next-line no-continue
                continue;
            }
            eventCounts.push({
                participantId: relationCount[otherKey],
                count: relationCount.count
            });
        }

        return eventCounts;
    };
}

/**
  * The configuration objects for the event types.
  *
  * The following properties are possible, but not present in all configs:
  *
  *  datasetType          - the graph dataset type this event type processes
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

const EventConfigs = {
    [EventTypes.MY_AFFIRMATIONS]: {
        datasetType: GraphDatasetTypes.AFFIRMATIONS,
        legendLabel: 'Your Affirmations',
        whatIsCounted: 'Affirmations',
        color: getColorForSelf(),
        getEventCounts: getEventCountsFn('key2'), // in affirmation relations key2 affirms key1
        getCountTooltip() {
            return 'You affirmed {participant}: {valueY}';
        },
        eventsFilter: (relatedUtterances, uid) => relatedUtterances.filter(uttPair => uttPair[1].participant === uid),
        getSourceParticipant(uttPair) {
            return uttPair[1].participant;
        }, // affirmer (you)
        getTargetParticipant(uttPair) {
            return uttPair[0].participant;
        }, // affirmed (other)
        getEventTime(uttPair) {
            return uttPair[1].startTime;
        }, // time of affirming utterance
        getTimelineTooltip({ target, eventTime }) {
            return `You affirmed ${target} at: ${eventTime}`;
        }
    },

    [EventTypes.THEIR_AFFIRMATIONS]: {
        datasetType: GraphDatasetTypes.AFFIRMATIONS,
        legendLabel: 'Their Affirmations',
        whatIsCounted: 'Affirmations',
        color: Colors.lightPurple,
        getEventCounts: getEventCountsFn('key1'), // in affirmation relations key2 affirms key1
        getCountTooltip() {
            return '{participant} affirmed you: {valueY}';
        },
        eventsFilter: (relatedUtterances, uid) => relatedUtterances.filter(uttPair => uttPair[0].participant === uid),
        getSourceParticipant(uttPair) {
            return uttPair[1].participant;
        }, // affirmer (other)
        getTargetParticipant(uttPair) {
            return uttPair[0].participant;
        }, // affirmed (you)
        getEventTime(uttPair) {
            return uttPair[1].startTime;
        }, // time of affirming utterance
        getTimelineTooltip({ source, eventTime }) {
            return `${source} affirmed you at: ${eventTime}`;
        }
    },

    [EventTypes.MY_INFLUENCE]: {
        datasetType: GraphDatasetTypes.INFLUENCES,
        whatIsCounted: 'Influences',
        legendLabel: 'Your Influences',
        color: getColorForSelf(),
        getEventCounts: getEventCountsFn('key1'), // in influence relations key1 influences key2
        getCountTooltip() {
            return 'You influenced {participant}: {valueY}';
        },
        eventsFilter: (relatedUtterances, uid) => relatedUtterances.filter(uttPair => uttPair[0].participant === uid),
        getSourceParticipant(uttPair) {
            return uttPair[0].participant;
        }, // influencer (you)
        getTargetParticipant(uttPair) {
            return uttPair[1].participant;
        }, // influenced (other)
        getEventTime(uttPair) {
            return uttPair[0].endTime;
        }, // time of influence
        getTimelineTooltip({ target, eventTime }) {
            return `You influenced ${target} at: ${eventTime}`;
        }
    },

    [EventTypes.THEIR_INFLUENCE]: {
        datasetType: GraphDatasetTypes.INFLUENCES,
        whatIsCounted: 'Influences',
        legendLabel: 'Their Influences',
        color: Colors.lightPurple,
        getEventCounts: getEventCountsFn('key2'), // in influence relations key1 influences key2
        getCountTooltip() {
            return '{participant} influenced you: {valueY}';
        },
        eventsFilter: (relatedUtterances, uid) => relatedUtterances.filter(uttPair => uttPair[1].participant === uid),
        getSourceParticipant(uttPair) {
            return uttPair[0].participant;
        }, // influencer (other)
        getTargetParticipant(uttPair) {
            return uttPair[1].participant;
        }, // influenced (you)
        getEventTime(uttPair) {
            return uttPair[0].endTime;
        }, // time of influence
        getTimelineTooltip({ source, eventTime }) {
            return `${source} influenced you at: ${eventTime}`;
        }
    },

    [EventTypes.MY_INTERRUPTIONS]: {
        datasetType: GraphDatasetTypes.INTERRUPTIONS,
        whatIsCounted: 'Interruptions',
        legendLabel: 'Your Interruptions',
        color: getColorForSelf(),
        getEventCounts: getEventCountsFn('key2'), // in interruption relations key2 interrupts key1
        getCountTooltip() {
            return 'You interrupted {participant}: {valueY}';
        },
        eventsFilter: (relatedUtterances, uid) => relatedUtterances.filter(uttPair => uttPair[1].participant === uid),
        getSourceParticipant(uttPair) {
            return uttPair[1].participant;
        }, // interrupter (you)
        getTargetParticipant(uttPair) {
            return uttPair[0].participant;
        }, // interrupted (other)
        getEventTime(uttPair) {
            return uttPair[1].startTime;
        }, // time of interrupting utterance
        getTimelineTooltip({ target, eventTime }) {
            return `You interrupted ${target} at: ${eventTime}`;
        }
    },

    [EventTypes.THEIR_INTERRUPTIONS]: {
        datasetType: GraphDatasetTypes.INTERRUPTIONS,
        whatIsCounted: 'Interruptions',
        legendLabel: 'Their Interruptions',
        color: Colors.lightPurple,
        getEventCounts: getEventCountsFn('key1'), // in interruption relations key2 interrupts key1
        getCountTooltip() {
            return '{participant} interrupted you: {valueY}';
        },
        eventsFilter: (relatedUtterances, uid) => relatedUtterances.filter(uttPair => uttPair[0].participant === uid),
        getSourceParticipant(uttPair) {
            return uttPair[1].participant;
        }, // interrupter (other)
        getTargetParticipant(uttPair) {
            return uttPair[0].participant;
        }, // interrupted (you)
        getEventTime(uttPair) {
            return uttPair[1].startTime;
        }, // time of interrupting utterance
        getTimelineTooltip({ source, eventTime }) {
            return `${source} interrupted you at: ${eventTime}`;
        }
    }
};

/* **************************************************************************** *
  * Module exports                                                               *
  * **************************************************************************** */
export {
    EventTypes,
    EventConfigs,
    GraphConfigs
};
