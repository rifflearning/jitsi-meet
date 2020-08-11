/* ******************************************************************************
 * url_utils.js                                                                *
 * *************************************************************************/ /**
 *
 * @fileoverview url manipulation related utils
 *
 * any utils related to url manipulation for the url sharing feature should
 * go here
 *
 * Created on       April 1, 2020
 * @author          Jordan Reedie
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

/* ******************************************************************************
 * convertYoutubeToEmbedLink                                               */ /**
 *
 * Converts a youtube link from (almost) any format to an embed link
 *
 * @param {String} the original youtube link
 *
 * @returns {String} the modified embed link
 */
function convertYoutubeToEmbedLink(url) {
    const ytFormat = 'https://www.youtube.com/embed/';
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    let id;
    if (match && match[2].length === 11) {
        id = match[2];
        return ytFormat + id + '?autoplay=1';
    }
    // error parsing URL, maybe it's not a youtube link?
    // just return the original URL
    return url;
}

export {
    convertYoutubeToEmbedLink,
};
