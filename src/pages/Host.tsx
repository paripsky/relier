import React, { useState, useEffect } from 'react';
import { DesktopCapturer, DesktopCapturerSource } from 'electron';
import { Box, Text } from '@chakra-ui/core';

const electron = window.require && window.require('electron');
const desktopCapturer: DesktopCapturer = electron && electron.desktopCapturer;

export default function Host() {
  const [sources, setSources] = useState<DesktopCapturerSource[]>([]);

  useEffect(() => {
    desktopCapturer &&
      desktopCapturer
        .getSources({ types: ['window', 'screen'] })
        .then(sources => setSources(sources));
  }, []);

  return (
    <Box>
      {sources.map(source => (
        <Box>
          <Text>{source.name}</Text>
          <Text>{source.id}</Text>
          <Text>{source.display_id}</Text>
          <img alt={source.name} src={source.thumbnail.toDataURL()} />
        </Box>
      ))}
    </Box>
  );
}
