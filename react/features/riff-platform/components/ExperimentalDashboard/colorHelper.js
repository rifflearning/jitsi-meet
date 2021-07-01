/* eslint-disable jsdoc/require-hyphen-before-param-description */
/* eslint-disable jsdoc/require-description-complete-sentence */
/* eslint-disable valid-jsdoc */
const Colors = {
    black: '#000000',
    mineShaft: '#333333',
    tundora: '#4a4a4a',
    riffVioletDark: '#775e80',
    riffViolet: '#93759e',
    lightRoyal: '#8a6a94',
    deepRed: '#ab0000',
    lightGrey: '#d3d3d3',
    mischka: '#e0d8e3',
    deepBlush: '#e380a1',
    darkYellow: '#f6da5c',
    purpleLight: '#F8EFFC',
    selago: '#f8effc',
    white: '#ffffff',
    scorpion: '#5a5a5a',
    doublePear: '#fcf1cd',
    iceBlue: '#eff9f9',
    zanah: '#e3f1df',
    starDust: '#8f8f8f',
    mercury: '#e5e5e5',
    riffVioletMedium: '#be99cb',
    lightPurple: '#f8effc',
    darkGray: '#828282'
};

// List of colors to use for peers in charts
const PeerColors = [
    Colors.riffVioletMedium,
    Colors.lightPurple,
    Colors.darkGray,
    Colors.riffVioletDark,
    Colors.riffViolet
];

/**
  * Get the color to use for the current user/self.
  * Returns the first entry in PeerColors.
  *
  * @returns {ColorString} A color string for the current user/self.
  */
function getColorForSelf() {
    return PeerColors[0];
}

/**
  * Get the color to use for the second user.
  * Returns the second entry in PeerColors.
  *
  * @returns {ColorString} A color string for the second user.
  */
function getColorForSecond() {
    return PeerColors[1];
}

/**
  * Get the color to use for the nth other.
  * Returns a color from PeerColors (that is not the 1st, 2nd entries which are reserved
  * for the 'self' and second user colors)
  * Colors will be "reused" for values of n > the number of PeerColors.
  * Every 5 users have the same color but with different color level.
  *
  * @param {number} n
  *      The number (0 based index) of an other to get a color string for.
  * * @param {string} currentColor
  *      The current color
  * * @param {string} currentTextColor
  *      The current text color.
  *
  * @returns {ColorString} a color string for the nth other.
  */
function getColorForOther(n, currentColor, currentTextColor) {
    const k = n % 5;
    let color = currentColor;
    let textColor = currentTextColor;

    if (k === 0) {
        const i = ((n / 5) % (PeerColors.length - 2)) + 2;

        color = PeerColors[i];
        textColor = Colors.white;
    } else if (n && n % 3 === 0) {
        textColor = Colors.mineShaft;
    }

    return {
        color,
        textColor,
        level: k / 5
    };
}

/* ******************************************************************************
  * getColorMap                                                             */ /**
*
* Given a array of ids and the id of "self", return a map of those ids to
* colors.
* Currently uses the Set order to determine the colors.
*
* @param {Array} ids - Sorted users array ids.
* @param {*} selfId
*
* @returns {Map}
*/
function getColorMap(ids, selfId) {

    const gradientColorsIds = ids.filter((id, index) =>
        (selfId === ids[0] ? index !== 1 : index !== 0)
    && id !== selfId);
    const mainColorsIds = ids.filter((id, index) =>
        (selfId === ids[0] ? index === 1 : index === 0)
    || id === selfId);

    const colorMap = new Map();

    for (const id of mainColorsIds) {
        if (id === selfId) {
            colorMap.set(id, {
                color: getColorForSelf(),
                textColor: Colors.white,
                level: 0
            });
        } else {
            colorMap.set(id, {
                color: getColorForSecond(),
                textColor: Colors.mineShaft,
                level: 0
            });
        }
    }
    let color = PeerColors[2];
    let textColor = Colors.white;

    let i = 0;

    for (const id of gradientColorsIds) {
        const colorConfig = getColorForOther(i, color, textColor);

        color = colorConfig.color;
        textColor = colorConfig.textColor;
        const level = colorConfig.level;

        colorMap.set(id, {
            color,
            level,
            textColor
        });
        i++;
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
    getColorMap
};
