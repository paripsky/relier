import {
  CONNECTED,
  START_CONNECTING,
  STREAMING,
  RECIEVING,
} from './connect.types';
import {
  connect as connectToSocket,
  call,
  sendMessage,
  SocketMessageTypes,
  Connection,
} from '../../connection';
import { DesktopCapturer } from 'electron';
import { Dispatch } from 'redux';

const electron = window.require && window.require('electron');
const desktopCapturer: DesktopCapturer = electron && electron.desktopCapturer;

export const startConnecting = (secret: string) => ({
  type: START_CONNECTING,
  secret,
});
export const connected = (secret: string) => ({
  type: CONNECTED,
  secret,
});
export const streaming = (id: string) => ({ type: STREAMING, streamId: id });
export const recieving = (id: string) => ({ type: RECIEVING, streamId: id });

const connections = new Map<string, Connection>();
const streams = new Map<string, MediaStream>();

export const hostAction = (secret: string, password: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(startConnecting(secret));
    const { connection, localConnection, token } = await connectToSocket(
      'ws://localhost:9000',
      secret,
      password
    );

    const onMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
    };
    connection.addEventListener('message', onMessage);
    connections.set(secret, { connection, localConnection, token });

    dispatch(connected(secret));
  };
};

export const connectAction = (secret: string, password: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(startConnecting(secret));
    const { connection, localConnection, token } = await connectToSocket(
      'ws://localhost:9000',
      secret,
      password
    );

    localConnection.ontrack = (event: RTCTrackEvent) => {
      const [stream] = event.streams;
      streams.set(secret, stream);
    };

    const onMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
    };
    connection.addEventListener('message', onMessage);
    connections.set(secret, { connection, localConnection, token });
    dispatch(connected(secret));
  };
};

export const StreamAction = (chromeMediaSourceId: string, secret: string) => {
  return async (dispatch: Dispatch) => {
    if (!connections.has(secret)) {
      console.error(`can't stream without a connection`);
      return;
    }

    const { connection, localConnection } = connections.get(
      secret
    ) as Connection;

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId,
          minWidth: 1280,
          maxWidth: 1280,
          minHeight: 720,
          maxHeight: 720,
        },
      } as any,
    });
    stream.getTracks().forEach(track => localConnection.addTrack(track));
    call(connection, localConnection, secret);
  };
};
