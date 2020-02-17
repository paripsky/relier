import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Box } from '@chakra-ui/core';
import streams from '../connection/streams';
import { registerEventDispatcher } from '../store/actions/events.actions';

export default function Streaming() {
  const remoteStream = useRef<HTMLVideoElement>(null);
  const dispatch = useDispatch();

  const stream = useSelector<RootState, MediaStream | undefined>(state => {
    if (state.connection.streamId) {
      const streamId = state.connection.streamId;
      const stream = streams.get(streamId);

      return stream;
    }
  });

  const secret = useSelector<RootState, string>(
    state => state.connection.secret
  );

  const isReceiving = useSelector<RootState, boolean>(
    state => state.connection.isReceiving
  );

  useEffect(() => {
    if (stream && remoteStream.current) {
      const videoElement = remoteStream.current;
      videoElement.srcObject = stream;
      isReceiving && dispatch(registerEventDispatcher(secret, videoElement));
    }
  }, [dispatch, isReceiving, secret, stream]);

  return (
    <Box>
      <video
        ref={remoteStream}
        autoPlay
        /*onClick={() => remoteStream?.current?.requestPointerLock()}*/
      />
    </Box>
  );
}
