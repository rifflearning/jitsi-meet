/* ******************************************************************************
 * external_redirect.jsx                                                        *
 * *************************************************************************/ /**
 *
 * @fileoverview ExternalRedirect component to redirect to a different site
 *
 * Created on       December 12, 2019
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import React from 'react';
import PropTypes from 'prop-types';

/* ******************************************************************************
 * ExternalRedirect                                                        */ /**
 *
 * React component intended to be used in a <Route> to do a client side
 * redirect to an external site.
 *
 * The implementation of this component was inspired by the answers and
 * comments on https://stackoverflow.com/questions/42914666/react-router-external-link
 *
 ********************************************************************************/
class ExternalRedirect extends React.Component {
    static propTypes = {
        href: PropTypes.string.isRequired,
    }

    render() {
        // Use replace so the back button doesn't hit this redirect again
        window.location.replace(this.props.href);
        return null;
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    ExternalRedirect,
};
