import React, { useState, useEffect } from 'react';
import { DesktopCapturer, DesktopCapturerSource } from 'electron';
import { PseudoBox, Box, Text } from '@chakra-ui/core';

const electron = window.require && window.require('electron');
const desktopCapturer: DesktopCapturer = electron && electron.desktopCapturer;

function Source({ source }: { source: DesktopCapturerSource }) {
  return (
    <PseudoBox
      m={2}
      p={2}
      w="150px"
      title={source.name}
      cursor="pointer"
      _hover={{ bg: 'gray.100', color: 'black' }}
    >
      <Text isTruncated>{source.name}</Text>
      <img alt={source.name} src={source.thumbnail.toDataURL()} />
    </PseudoBox>
  );
}

export default function Host() {
  const [screens, setScreens] = useState<DesktopCapturerSource[]>([]);
  const [windows, setWindows] = useState<DesktopCapturerSource[]>([]);

  useEffect(() => {
    desktopCapturer &&
      desktopCapturer
        .getSources({ types: ['screen'] })
        .then(sources => setScreens(sources));
    desktopCapturer &&
      desktopCapturer
        .getSources({ types: ['window'] })
        .then(sources => setWindows(sources));
  }, []);

  return (
    <Box width="100%" p={2} d="flex" flexDir="column" mr="auto" ml="auto">
      <Text fontSize="3xl">Select a Screen or Window to Share:</Text>
      <Box>
        <Text fontSize="xl">Screens</Text>
        <Box d="flex">
          {screens.map(screen => (
            <Source source={screen} />
          ))}
        </Box>
      </Box>
      <Box>
        <Text fontSize="xl">Windows</Text>
        <Box d="flex" flexWrap="wrap">
          {windows.map(window => (
            <Source source={window} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
