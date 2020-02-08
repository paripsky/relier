// @ts-nocheck
import { CONNECTED, START_CONNECTING, STREAMING } from './connect.types';
import {
  connect as connectToSocket,
  call,
  sendMessage,
  SocketMessageTypes,
} from '../../connection';
import { Dispatch } from 'redux';

export const startConnecting = secret => ({ type: START_CONNECTING, secret });
export const connected = secret => ({ type: CONNECTED, secret });
export const streaming = id => ({ type: STREAMING, streamId: id });

const connections = {};
let myId;

export const hostAction = (secret: string, password: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(startConnecting(secret));
    const { connection, localConnection } = await connectToSocket(
      'ws://localhost:9000',
      (stream: MediaStream) => {
        (window as any)['streams'] = {};
        (window as any)['streams']['0'] = stream;
        dispatch(streaming('0'));
      },
      secret,
      {
        onLogin: id => {
          dispatch(connected(id));
          myId = id;
        },
      }
    );

    sendMessage(connection, { type: SocketMessageTypes.login, secret });

    connections[secret] = { connection, localConnection };
  };
};

export const connectAction = (secret, to) => {
  return dispatch => {
    window
      .require('electron')
      .desktopCapturer.getSources({ types: [/* 'window', */ 'screen'] })
      .then(async sources => {
        const source = sources[0];
        navigator.mediaDevices
          .getUserMedia({
            audio: false,
            video: {
              mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source.id,
                minWidth: 1280,
                maxWidth: 1280,
                minHeight: 720,
                maxHeight: 720,
              },
            } as any,
          })
          .then(async stream => {
            const { connection, localConnection } = connections[secret];
            localConnection.addStream(stream);
            call(connection, localConnection, secret);
          });
      });
  };
};
