/* eslint-disable no-undef */
import auth from '@feathersjs/authentication-client';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import io from 'socket.io-client';

// access to api

let dataserverPath = '/api/videodata';

dataserverPath += '/socket.io';

const socket = io(process.env.RIFF_SERVER_URL, {
    timeout: 20000,
    path: dataserverPath,
    transports: [
        'websocket',
        'flashsocket',
        'htmlfile',
        'xhr-polling',
        'jsonp-polling'
    ]
});

const app = feathers()
     .configure(socketio(socket), { timeout: 10000 })
     .configure(auth());

// participantEvents service still seems to end up w/ a timeout of 5000 even with
// the above timeouts specified. So try setting that service's timeout directly
app.service('participantEvents').timeout = 9000;

export {
    app,
    socket
};
