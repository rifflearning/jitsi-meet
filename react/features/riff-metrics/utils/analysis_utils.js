/* ******************************************************************************
 * analysis_utils.js                                                            *
 * *************************************************************************/ /**
 *
 * @fileoverview Data analysis related utility functions
 *
 * Note: The Pair type used in this module is an Array with 2 and only 2 elements.
 *
 * Created on       April 1, 2020
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

/*eslint-disable*/
/* ******************************************************************************
 * computePairwiseRelations                                                */ /**
 *
 * Get the list of related items as determined by the isRelated predicate
 * function. Every item in the given orderedItems list will be "compared"
 * to every other item in that list.
 *
 * The isRelated predicate that determines if there is a relationship between
 * 2 items is always called with 2 items from the item list with the 1st
 * item argument being before the 2nd item argument in the item list.
 *
 * As an optimization, the isPossiblyRelated function may be supplied to
 * determine if an earlier item in the list can be related to any items
 * later than the first of the remaining items to be tested, and if that
 * function returns false, that earlier item will not be compared any of
 * the later items.
 *
 * DevNote:
 *  The algorithm used is:
 *    Split the ordered items in 2, items from the front of the list
 *    to be compared against all the remaining items in the list,
 *    and the remaining items in the list.
 *    Then:
 *    - Optimize by using the isPossiblyRelated function to remove items
 *      from the first list before comparing against the 1st item in the
 *      2nd list.
 *    - Compare all the items in the first list against the 1st item in
 *      the 2nd list.
 *    - Move the 1st item in the 2nd list to the 1st list.
 *    - Repeat until there are no more items in the 2nd list.
 *
 * @param {Array<Item>} orderedItems - The items to be compared (order is only
 *      important to the order of arguments to the predicates supplied).
 *
 * @param {function(item1: Item, item2: Item): boolean} isRelated
 *      function that returns true if the 2 given items are related
 *      item2 will always be from after item1 in the orderedItems list.
 *
 * @param {?function(firstRemainingItem: Item): function(comparisonItem: Item): boolean} isPossiblyRelated
 *      function that returns a function that compares an item against the
 *      firstRemainingItem and returns true if the comparisonItem cannot be
 *      related to the firstRemainingItem or ANY of the items that follow it
 *      in the orderedItems list. This is an optional argument and may be null
 *      or undefined.
 *
 * @returns {Array<Pair<Item>>} An array of pairs of items that are related
 */
function computePairwiseRelations(orderedItems, isRelated, isPossiblyRelated) {
    // The 1st item has nothing before it to compare against so immediately move it from the
    // remaining list to the candidate list
    let candidateItems = orderedItems.slice(0, 1);
    const remainingItems = orderedItems.slice(1);

    const relatedItems = [];

    for (const testItem of remainingItems) {
        // remove candidateItems that can't be related to any remainingItems so we don't bother testing them
        if (isPossiblyRelated) {
            candidateItems = candidateItems.filter(isPossiblyRelated(testItem));
        }

        const newRelatedItems = candidateItems
            .filter(item => isRelated(item, testItem)) // determine if the candidate item is related to the test item
            .map(item => [ item, testItem ]);

        // append new related items
        relatedItems.push(...newRelatedItems);

        // the test item becomes a candidate to test against the remaining items
        candidateItems.push(testItem);
    }

    return relatedItems;
}


/* ******************************************************************************
 * countRelations                                                          */ /**
 *
 * Count the relations when grouping the Items in the relations by a property
 * key.
 *
 * Notes:
 *  - relations are pairs of Items (an item can be almost anything).
 *  - a relation is not commutative ie the pair [item1, item2] is NOT the
 *    same as the pair [item2, item1].
 *  - It may be that the item key of item1 and item2 are the same, that is
 *    the responsibility of the caller and the supplied getItemKey function.
 *
 * @param {Array<Pair<Item>>} relations
 * @param {function(item: Item): string} getItemKey
 *
 * @returns {Map<string, { key1: string, key2: string, count: number }>}
 */
function countRelations(relations, getItemKey) {
    const relationCounts = new Map();

    for (const relation of relations) {
        const key1 = getItemKey(relation[0]);
        const key2 = getItemKey(relation[1]);
        const relationKey = key1 + key2;

        if (relationCounts.has(relationKey)) {
            relationCounts.get(relationKey).count++;
        } else {
            relationCounts.set(relationKey, { key1,
                key2,
                count: 1 });
        }
    }

    return relationCounts;
}

/* ******************************************************************************
 * computeUtterancePairwiseRelations                                       */ /**
 *
 * Get all pairs of utterances from the given ordered list of utterances
 * where a given binary relationship is true. Count the identical pairs when
 * each utterance in a pair is identified by its participant id.
 *
 * The given isRelated function will be called for every pair of utterances
 * and every pair where that function returns true will be returned and counted.
 *
 * Example: Influence is a binary relation. Two utterances form an influence
 *  iff the second one starts within 3 seconds of when the first one ends.
 *  This function would compute for every pair of utterances whether the influence
 *  relation holds. It would then compute for every pair of participants the number
 *  of times one participant influences another. It returns a list of these counts,
 *  with one entry in the list for every pair of participants with at least 1
 *  influence event.
 *
 * TODO: Change this to return ONLY the counts array of count objects
 *      where a count object is:
 *      { participants: Pair<Participant>,  // or participant1 and participant2 ?
 *        count: number }.
 *
 * @param {Array<Utterance>} sortedUtterances
 *      All utterances, sorted by startDate.
 *
 * @param {Map<string, Participant>} speakingParticipants
 *      All participants referenced by sortedUtterances.
 *
 * @param {function(ut1: Utterance, ut2: Utterance): boolean} isRelated
 *      function that returns true if the 2 given utterances are related
 *      ut2 will always be from after ut1 in the sortedUtterances list.
 *
 * @param {?function(firstRemainingUt: Utterance): function(comparisonUt: Utterance): boolean} isPossiblyRelated
 *      function that returns a function that compares an utterance against the
 *      firstRemainingUt and returns true if the comparisonUt cannot be
 *      related to the firstRemainingUt or ANY of the items that follow it
 *      in the sortedUtterances list.
 *      This is an optional argument used for efficiency and may be null
 *      or undefined.
 *      - If unused, runtime is O(|sortedUtterances|^2).
 *      - If used, runtime is O(K*|sortedUtterances|), where K is the largest
 *        number of pairs of utterances that occur close enough together to be
 *        candidates for the binaryRelation
 *
 * @returns {{ finalEdges: Array, events: Array }} object containing both the
 *      counts array (finalEdges) and the relations (events).
 *      finalEdges is an array containing 0 or more "relationCount" objects.
 *      A relationCount is:
 *      { source: a participant id,
 *        sourceName: a string,
 *        target: a participant id,
 *        targetName: a string,
 *        size: a count of the number of utterance pairs made by source & target where
 *              binaryRelation was true }
 *      events is an array containing the related utterances as an eventObject.
 *      An eventObject is:
 *      { earlierUtt: { utt: Utterance,
 *                      otherUtt: Utterance,
 *                      participantName: string,
 *                      otherParticipantName: string },
 *        laterUtt:   { utt: Utterance,                     // === earlierUtt.otherUtt
 *                      otherUtt: Utterance,                // === earlierUtt.outt
 *                      participantName: string,            // === earlierUtt.otherParticipantName
 *                      otherParticipantName: string } }    // === earlierUtt.participantName
 */
function computeUtterancePairwiseRelations(sortedUtterances, participants, isRelated, isPossiblyRelated) {
    const relatedUtterances = computePairwiseRelations(sortedUtterances, isRelated, isPossiblyRelated);
    const relationCounts = countRelations(relatedUtterances, u => u.participant);

    // functions used to recreate the old (refactored) function's return value

    const getParticipantName = pId => participants.get(pId).name || 'no name found';

    // Create an event object for the relation of the testUt to the relatedUt
    const makeEvent = relation => {
        const earlierUt = relation[0];
        const earlierParticipantName = getParticipantName(earlierUt.participant);
        const laterUt = relation[1];
        const laterParticipantName = getParticipantName(laterUt.participant);

        return {
            earlierUtt: {
                utt: earlierUt,
                otherUtt: laterUt,
                participantName: earlierParticipantName,
                otherParticipantName: laterParticipantName
            },
            laterUtt: {
                utt: laterUt,
                otherUtt: earlierUt,
                participantName: laterParticipantName,
                otherParticipantName: earlierParticipantName
            }
        };
    };

    const makeEdge = relationCount => {
        return {
            // id: this property was in the old value, but is never used, so I don't bother recreating it -mjl
            source: relationCount.key1,
            sourceName: getParticipantName(relationCount.key1),
            target: relationCount.key2,
            targetName: getParticipantName(relationCount.key2),
            size: relationCount.count
        };
    };

    // recreate the return value of the computePairwiseRelation function being
    // refactored. (TODO: I think we could have a better return value -mjl)

    const finalEdges = Array.from(relationCounts.values(), makeEdge);
    const events = relatedUtterances.map(makeEvent);

    console.log('analysis_utils.computeUtterancePairwiseRelations is returning:', { finalEdges,
        events });

    return { finalEdges,
        events };
}


/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    computeUtterancePairwiseRelations
};
