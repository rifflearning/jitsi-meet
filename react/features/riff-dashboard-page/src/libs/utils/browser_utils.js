/* ******************************************************************************
 * browser_utils.js                                                             *
 * *************************************************************************/ /**
 *
 * @fileoverview Browser utils that modify the DOM or use browser capabilities
 *
 * Created on        December 5, 2019
 * @author           Michael Jay Lippert
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

/**
 * Enable or disable the ability to scroll the html element.
 *
 * Since disabling scrolling removes the scrollbar, add padding to the html
 * element that is equal to the width of the scroll bar.
 *
 * TODO: perhaps add an arg to determine if 'auto' or 'scroll' should be used
 *       as the value for overflow-y when enabling the window scrollbar
 *       for now we just use 'auto' letting the user agent determine what to
 *       do when there is no overflow.
 *
 * @param {boolean} enableScrolling - should window scrolling be enabled or disabled
 */
function setWindowScrolling(enableScrolling) {
    const htmlElement = document.documentElement;

    if (enableScrolling) {
        htmlElement.style.cssText = `overflow-y: auto; padding-right: 0;`;
    }
    else {
        const scrollBarWidth = window.innerWidth - htmlElement.offsetWidth;
        htmlElement.style.cssText = `overflow-y: hidden; padding-right: ${scrollBarWidth}px;`;
    }
}

/**
 * Determine if the browser supports webrtc screen sharing
 */
function isScreenShareSourceAvailable() {
    // currently we only support chrome v70+ (w/ experimental features enabled, if necessary)
    // and firefox
    return !!(navigator.getDisplayMedia ||
              navigator.mediaDevices.getDisplayMedia ||
              navigator.mediaDevices.getSupportedConstraints().mediaSource);
}

/**
 * Determine if CSS animations are supported
 *
 * This function was found at:
 * @see <https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Detecting_CSS_animation_support>
 *
 * Here's the explanation of how this works (from the above page):
 *  For starters we define a few variables. We assume that animation is not
 *  supported by setting animation to false. We set the animationstring to
 *  animation which is the property we want to set later on. We create an array
 *  of browser prefixes to loop over and we set pfx to an empty string.
 *
 *  Then we check if the CSS animation-name property on the style collection for
 *  the element specified by the variable elem is set. This means the browser
 *  supports CSS animation without any prefix, which, to date, none of them do.
 *
 *  If the browser does not support non-prefixed animation and animation is still
 *  false, we iterate over all the possible prefixes, since all the major
 *  browsers are currently prefixing this property and changing its name to
 *  AnimationName instead.
 *
 *  Once this code is finished running, the value of animation will be false if
 *  CSS animation support isn't available, or it will be true. If it is true then
 *  both the animation property name and the keyframe prefix will be the right
 *  ones. So if you use a new Firefox, the property will be MozAnimation and the
 *  keyframe prefix -moz- and with Chrome it'll be WebkitAnimation and -webkit-.
 *  Notice browsers don't make it easy with the switching between camelCase and
 *  hyphen-ation.
 */
function isCSSAnimationsSupported() {
    let animation = false;
    let animationstring = 'animation';
    let keyframeprefix = '';
    const domPrefixes = [ 'Webkit', 'Moz', 'O', 'ms', 'Khtml' ];
    let pfx = '';
    const elem = document.createElement('div');

    if (elem.style.animationName !== undefined) {
        animation = true;
    }

    if (!animation) {
        for (let i = 0; i < domPrefixes.length; i++) {
            if (elem.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
                pfx = domPrefixes[i];
                animationstring = pfx + 'Animation';            // eslint-disable-line no-unused-vars
                keyframeprefix = '-' + pfx.toLowerCase() + '-'; // eslint-disable-line no-unused-vars
                animation = true;
                break;
            }
        }
    }

    return animation;
}

/**
 * Temporarily adds a div to the DOM
 * (for one second)
 *
 * Contents of div will be read by screen reader
 * When passing a priority, the options are:
 *   1. 'assertive' - will interupt the current speech
 *   2. 'polite'(default) - will be read when current speech completes
 *   *Note: these are standards, but exact functionality can vary between screen readers
 */
function addA11yBrowserAlert(text, alertPriority) {
    const newAlert = document.createElement('div');
    const id = 'speak-' + Date.now();

    newAlert.setAttribute('id', id);
    newAlert.setAttribute('role', 'alert');
    newAlert.classList.add('a11y-browser-alert');
    newAlert.setAttribute('aria-live', alertPriority ? alertPriority : 'polite');
    newAlert.setAttribute('aria-atomic', 'true');

    document.body.appendChild(newAlert);

    window.setTimeout(function () {
        document.getElementById(id).innerHTML = text;
    }, 100);

    window.setTimeout(function () {
        document.body.removeChild(document.getElementById(id));
    }, 1000);
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    addA11yBrowserAlert,
    isCSSAnimationsSupported,
    isScreenShareSourceAvailable,
    setWindowScrolling,
};
