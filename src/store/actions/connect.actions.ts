import {
  CONNECTED,
  START_CONNECTING,
  STREAMING,
  RECIEVING,
} from './connect.types';
import { connect as connectToSocket, call } from '../../connection';
import { Dispatch } from 'redux';
import streams from '../../connection/streams';
import connections from '../../connection/connections';
import Connection from '../../models/Connection';
import dataChannels from '../../connection/dataChannels';

export const startConnecting = (secret: string) => ({
  type: START_CONNECTING,
  secret,
});
export const connected = (secret: string) => ({
  type: CONNECTED,
  secret,
});
export const streaming = (streamId: string) => ({
  type: STREAMING,
  streamId,
});
export const recieving = (streamId: string) => ({ type: RECIEVING, streamId });

export const hostAction = (secret: string, password: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(startConnecting(secret));
    const { connection, localConnection, token } = await connectToSocket(
      'ws://localhost:9000',
      secret,
      password
    );

    connections.set(secret, { connection, localConnection, token });
    const dc = localConnection.createDataChannel('events');

    dc.onmessage = function(event) {
      console.log('received: ' + event.data);
    };

    dc.onopen = function() {
      console.log('datachannel open');
      dataChannels.set(secret, dc);
    };

    dc.onclose = function() {
      console.log('datachannel close');
    };

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
      dispatch(recieving(secret));
    };

    connections.set(secret, { connection, localConnection, token });
    localConnection.ondatachannel = event => {
      const { channel: dataChannel } = event;

      dataChannel.onmessage = function(event) {
        console.log('received: ' + event.data);
      };

      dataChannel.onopen = function() {
        console.log('datachannel open');
      };

      dataChannel.onclose = function() {
        console.log('datachannel close');
      };

      dataChannels.set(secret, dataChannel);
    };

    dispatch(connected(secret));
  };
};

export const streamAction = (chromeMediaSourceId: string, secret: string) => {
  return async (dispatch: Dispatch) => {
    if (!connections.has(secret)) {
      console.error(`can't stream without a connection`);
      return;
    }

    const { connection, localConnection, token } = connections.get(
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
    streams.set(secret, stream);
    stream
      .getTracks()
      .forEach(track => localConnection.addTrack(track, stream));
    call(connection, localConnection, token);
    dispatch(streaming(secret));
  };
};
