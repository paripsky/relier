import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Box } from '@chakra-ui/core';
import streams from '../store/streams';

export default function Streaming() {
  const remoteStream = useRef<HTMLVideoElement>(null);

  const stream = useSelector<RootState, MediaStream | undefined>(state => {
    if (state.connection.streamId) {
      const streamId = state.connection.streamId;
      const stream = streams.get(streamId);

      return stream;
    }
  });

  useEffect(() => {
    if (stream && remoteStream.current) {
      remoteStream.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <Box>
      <video ref={remoteStream} autoPlay />
    </Box>
  );
}
