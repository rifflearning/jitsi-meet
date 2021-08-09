/* ******************************************************************************
 * survey.js                                                                    *
 * *************************************************************************/ /**
 *
 * @fileoverview Provides a surveys object to get static and dynamic survey urls
 *
 * Created on       December 12, 2019
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { getSurveySettings } from 'Redux/selectors/config';

/* ******************************************************************************
 * initSurveyUrls                                                          */ /**
 *
 * Create the surveys object from configuration values
 *
 * @param {SurveyConfig} surveyConfig
 *
 * @returns {Object} surveys object w/ properties for static urls and
 *      methods to get urls w/ specified query param values
 */
function initSurveyUrls(surveyConfig = {}) {
    const base = `https://${surveyConfig.domain}`;
    return {
        registerUrl:            new URL(surveyConfig.registerPath, base).href,
        loginUrl:               new URL(surveyConfig.loginPath, base).href,
        completeBaselineUrl:    new URL(surveyConfig.completeBaselinePath, base).href,
        getPostMeetingUrl(uid) {
            const url = new URL(surveyConfig.postMeetingPath, base);
            url.search = new URLSearchParams({ UUID: uid }).toString();
            return url.href;
        },
    };
}

const surveys = initSurveyUrls(getSurveySettings());

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    surveys,
};
