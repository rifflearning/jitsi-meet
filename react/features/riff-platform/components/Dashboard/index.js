/* eslint-disable react/no-multi-comp */
import React, { useEffect } from 'react';

import Dashboard from './DashboardView';

const DashboardPage = () => {
    useEffect(() => {
        const $style = document.createElement('style');

        document.head.appendChild($style);
        $style.innerHTML = `
            body, html {
                height: auto;
            }
            `;

        return () => {
            $style.parentNode.removeChild($style);
        };
    }, []);

    return (<div id = 'riff-dashboard-page-full'>
        <div id = 'main-content-container'>
            <Dashboard />
        </div>
    </div>);
};

export default () =>
    <DashboardPage />
;
