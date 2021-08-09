/* ******************************************************************************
 * EmptyRoom.jsx                                                                *
 * *************************************************************************/ /**
 *
 * @fileoverview React component to display a placeholder for remote videos
 *
 * This is displayed when there are no other users in a meeting yet
 *
 * Created on       May 13, 2019
 * @author          Jordan Reedie
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/
import React from 'react';

import { ScaleLoader } from 'react-spinners';

import { Colors } from 'libs/utils';

const EmptyRoom = () => (
    <div className='column'>
        <div className='columns has-text-centered is-centered'>
            <div
                className='columns has-text-centered is-centered is-vcentered'
                style={{ minHeight: '80vh', minWidth: '80vw' }}
            >
                <div className='column is-vcentered has-text-centered'>
                    <h1>{'Nobody else here...'}</h1>
                    <ScaleLoader color={Colors.lightRoyal}/>
                </div>
            </div>
        </div>
    </div>
);

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    EmptyRoom,
};
