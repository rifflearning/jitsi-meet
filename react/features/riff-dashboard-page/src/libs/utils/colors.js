/* ******************************************************************************
 * colors.js                                                                    *
 * *************************************************************************/ /**
 *
 * @fileoverview Colors used by Riff
 *
 * By naming the color values it is easier to track where they are used and
 * to be more consistent in the use of colors.
 *
 * Created on        April 15, 2019
 * @author           Michael Jay Lippert
 *
 * @copyright (c) 2018-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { logger } from './logger';

/**
 * Give some name to colors we may want to use
 * I lifted names from https://graf1x.com/list-of-colors-with-color-names/ that are
 * similar, but the colors below ARE NOT the official colors for those name!
 * It's just important to have a more easily recognizable name than the color value
 * in order to determine where the same color is used in the code.
 * Keep this enum sorted by color value to make it easier to find a color.
 */
const Colors = {
    black:           '#000000',
    denim:           '#0f4ebd',
    turkoise:        '#128ead',
    aquamarine:      '#1b998b',
    eggplant:        '#321325',
    mineShaft:       '#333333',
    darkFern:        '#3c493f',
    tundora:         '#4a4a4a',
    lightAnchor:     '#576066',
    turquoiseBlue:   '#58d0ee',
    lightAnchor2:    '#607071',
    sage:            '#7caf5f',
    riffVioletDark:  '#775e80',
    babyBlue:        '#77adff',
    mauve:           '#85638c',
    lightRoyal:      '#8a6a94',
    africanLollipop: '#923a92',
    vibrantGreen:    '#92ff77',
    riffViolet:      '#93759e',
    deepRed:         '#ab0000',
    brightPlum:      '#ab45ab',
    lightGreen:      '#b0e890',
    lightLava:       '#bdc3c7',
    lightGrey:       '#d3d3d3',
    mischka:         '#e0d8e3',
    deepBlush:       '#e380a1',
    lighterGrey:     '#ededed',
    linen:           '#fbeae5',
    apricot:         '#f2a466',
    brightRed:       '#f44336',
    casablanca:      '#f5b642',
    reddishPeach:    '#f56b6b',
    darkYellow:      '#f6da5c',
    purpleWhite:     '#f6f0fb',
    selago:          '#f8effc',
    purplishWhite:   '#f9f6fc',
    redPunch:        '#ff6384',
    pink:            '#ff7792',
    orange:          '#ff6c3f',
    cornflowerLilac: '#ffadad',
    lightOrange:     '#ffad77',
    white:           '#ffffff',
};

/**
 * List of colors to use for peers in charts and other places it is
 * useful to associate a color to help distinguish a list of "things".
 * Use the 1st color (peerColors[0]) as the self color when that matters.
 *
 * Note: Where possible, using css would be preferable to using these colors
 * so this list also exist and needs to be kept in sync w/ what's in
 * sass/components/_bulma.scss
 */
const PeerColors = [
    Colors.riffViolet,
    Colors.casablanca,
    Colors.turquoiseBlue,
    Colors.lightGreen,
    Colors.cornflowerLilac,
    Colors.apricot,
    Colors.eggplant,
    Colors.darkFern,
    Colors.aquamarine,
];

/**
 * Append a hex opacity value to a hex color string
 * Currently only supports 6 digit color string of the form
 * '#rrggbb' e.g. '#4c338a'
 *
 * @example rgba(Colors.brightPlum, 0.5) returns '#ab45ab80'
 *
 * @param {string} hexColor
 * @param {number} opacity - fractional opacity, from 0 (totally clear) to 1 (totally opaque)
 *
 * @returns {string} a hex color string including the opacity (#rrggbbaa)
 *      e.g. '#ab45ab80'
 */
function rgbaColor(hexColor, opacity) {
    // convert opacity to hex value
    const hexOpacity = Math.round(0xff * opacity).toString(16);
    return `${hexColor}${hexOpacity.length === 1 ? '0' : ''}${hexOpacity}`;
}

/**
 * Get the color to use for the current user/self.
 * Returns the first entry in PeerColors.
 *
 * @returns {ColorString} a color string for the current user/self.
 */
function getColorForSelf() {
    return PeerColors[0];
}

/**
 * Get the color to use for the nth other.
 * Returns a color from PeerColors (that is not the 1st entry which is reserved
 * for the 'self' color)
 * Colors will be "reused" for values of n > the number of PeerColors.
 *
 * @param {number} n
 *      The number (0 based index) of an other to get a color string for.
 *
 * @returns {ColorString} a color string for the nth other.
 */
function getColorForOther(n) {
    const i = n % (PeerColors.length - 1) + 1;
    return PeerColors[i];
}

/* ******************************************************************************
 * getCountOtherColors                                                     */ /**
 *
 * Get an array of colors for count others. The colors will be taken from
 * PeerColors, excluding the 1st entry which is reserved for the 'self' color.
 * Colors will be repeated as necessary in order to return count colors.
 *
 * @param {number} cnt
 *      The number of colors to be returned
 *
 * @returns {Array<ColorString>} an array of count color strings.
 */
function getCountOtherColors(cnt) {
    // 0 or anything else falsy should just return an empty array
    if (!cnt) {
        return [];
    }

    const numDistinctOtherColors = PeerColors.length - 1;
    const colorListDups = Math.trunc(numDistinctOtherColors / cnt);
    const extraColors = numDistinctOtherColors % cnt;

    const cntOtherColors = [];
    if (colorListDups > 0) {
        const otherColors = PeerColors.slice(1);
        for (let i = colorListDups; i > 0; --i) {
            cntOtherColors.push(...otherColors);
        }
    }

    cntOtherColors.push(...PeerColors.slice(1, extraColors + 1));

    return cntOtherColors;
}

/* ******************************************************************************
 * getColorMap                                                             */ /**
 *
 * Given a Set of ids and the id of "self", return a map of those ids to
 * colors.
 * Currently uses the Set order to determine the colors. A possible enhancement
 * would be to sort the set keys first.
 *
 * @param {Set<*>} setIds
 * @param {*} selfId
 *
 * @returns {Map}
 */
function getColorMap(setIds, selfId) {
    if (setIds.size > PeerColors.length) {
        // This warning may be off by one because it assumes that selfId is in setIds
        logger.warn(`getColorMap: Not enough distinct colors (${PeerColors.length}) for all ids (${setIds.size})`);
    }

    const colorMap = new Map();
    let i = 0;
    for (const id of setIds) {
        if (id === selfId) {
            colorMap.set(id, getColorForSelf());
        }
        else {
            colorMap.set(id, getColorForOther(i));
            i++;
        }
    }

    return colorMap;
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    Colors,
    PeerColors,
    getColorForSelf,
    getColorForOther,
    getColorMap,
    getCountOtherColors,
    rgbaColor,
};
