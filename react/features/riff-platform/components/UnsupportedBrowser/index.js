/* global interfaceConfig */

import React from 'react';

const UnsupportedMobileBrowser = () => (
    <div className = 'unsupported-desktop-browser'>
        <h2 className = 'unsupported-desktop-browser_title'>
            It looks like you're using a browser we don't support.
        </h2>
        <p className = 'unsupported-desktop-browser__description' >
            Please try again with another browser or use {interfaceConfig.APP_NAME} on desktop to join calls.
        </p>
    </div>
);

export default UnsupportedMobileBrowser;
