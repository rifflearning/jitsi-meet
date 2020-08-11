/* ******************************************************************************
 * collection_utils.js                                                          *
 * *************************************************************************/ /**
 *
 * @fileoverview utils to help manipulating collections (arrays, dictionaries ie objects)
 *
 * These utility functions were create to help removing the use of the
 * underscore package for functionality which is basically now supplied as
 * part of the ecmascript language, particularly given these small functions.
 *
 * Created on        April 15, 2019
 * @author           Michael Jay Lippert
 *
 * @copyright (c) 2018-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

/**
 * Returns an object whose properties are the values of the specified
 * property of the members of the given array. The value of those
 * properties is an array containing the members of the original
 * array with the property with that value.
 *
 * Replaces one use of the underscore package's groupBy function.
 */
function groupByPropertyValue(a, p) {
    return a.reduce((grouped, cur) => {
        if (!(cur[p] in grouped)) {
            grouped[cur[p]] = [];
        }
        grouped[cur[p]].push(cur);
        return grouped;
    }, {});
}

/**
 * Returns an object whose properties are the values of the specified
 * property of the members of the given array. The value of those
 * properties is the count of the number of elements in the original
 * array with that property value.
 *
 * Replaces one use of the underscore package's countBy function.
 */
function countByPropertyValue(a, p) {
    return a.reduce((grouped, cur) => {
        if (!(cur[p] in grouped)) {
            grouped[cur[p]] = 0;
        }
        ++grouped[cur[p]];
        return grouped;
    }, {});
}

/**
 * Returns a new object with the same properties as the given
 * object, but whose values are those returned by the given
 * function. The given function takes 2 args, the property
 * value and the property key.
 *
 * Replaces the underscore mapObject function.
 */
function mapObject(o, f) {
    const newO = { ...o };
    for (const [ k, v ] of Object.entries(newO)) {
        newO[k] = f(v, k);
    }
    return newO;
}

/**
 * Get a comparison functor for the property of an object whose
 * values can be compared using the standard comparison operators.
 *
 * @returns {function(a, b)}
 *      A function that takes 2 object, a and b, and returns
 *      -1 if a[prop] < b[prop], 1 if a[prop] > b[prop], 0 if a[prop] = b[prop]
 */
function cmpObjectProp(prop) {
    return (a, b) => {
        return a[prop] < b[prop] ? -1 : a[prop] > b[prop] ? 1 : 0; // eslint-disable-line no-nested-ternary
    };
}

/**
 * Return a function that reverses the sense of the given comparison
 * functor. So when used with the Array.sort it will turn an ascending
 * sort into a descending sort (and vice-versa).
 */
function reverseCmp(cmp) {
    return (a, b) => cmp(b, a);
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    cmpObjectProp,
    countByPropertyValue,
    groupByPropertyValue,
    mapObject,
    reverseCmp,
};
