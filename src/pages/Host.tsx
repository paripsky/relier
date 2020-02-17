import React, { useState, useEffect } from 'react';
import { DesktopCapturer, DesktopCapturerSource } from 'electron';
import { PseudoBox, Box, Text, Button } from '@chakra-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { streamAction } from '../store/actions/connect.actions';
import { RootState } from '../store';
import useTheme from '../useTheme';

const electron = window.require && window.require('electron');
const desktopCapturer: DesktopCapturer = electron && electron.desktopCapturer;

function Source({
  source,
  onClick,
  isSelected,
}: {
  source: DesktopCapturerSource;
  onClick: (id?: string) => void;
  isSelected: boolean;
}) {
  return (
    <PseudoBox
      m={2}
      p={2}
      w="150px"
      title={source.name}
      cursor="pointer"
      _hover={{ bg: 'gray.100', color: 'black' }}
      bg={isSelected ? 'gray.200' : undefined}
      onClick={() => onClick(source.id)}
    >
      <Text isTruncated>{source.name}</Text>
      <img alt={source.name} src={source.thumbnail.toDataURL()} />
    </PseudoBox>
  );
}

export default function Host() {
  const [screens, setScreens] = useState<DesktopCapturerSource[]>([]);
  const [windows, setWindows] = useState<DesktopCapturerSource[]>([]);
  const { primary } = useTheme();
  const [selectedMediaId, setSelectedMediaId] = useState<string>();
  const dispatch = useDispatch();

  const secret = useSelector<RootState, string>(
    state => state.connection.secret
  );

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

  const stream = () => {
    selectedMediaId && dispatch(streamAction(selectedMediaId, secret));
  };

  return (
    <Box width="100%" p={2} d="flex" flexDir="column" mr="auto" ml="auto">
      <Box d="flex" justifyContent="space-between">
        <Text fontSize="3xl">Select a Screen or Window to Share:</Text>
        <Button variant="outline" variantColor={primary} onClick={stream}>
          Next
        </Button>
      </Box>
      <Box overflow="auto">
        <Box>
          <Text fontSize="xl">Screens</Text>
          <Box d="flex">
            {screens.map(screen => (
              <Source
                source={screen}
                onClick={setSelectedMediaId}
                isSelected={screen.id === selectedMediaId}
              />
            ))}
          </Box>
        </Box>
        <Box>
          <Text fontSize="xl">Windows</Text>
          <Box d="flex" flexWrap="wrap">
            {windows.map(window => (
              <Source
                source={window}
                onClick={setSelectedMediaId}
                isSelected={window.id === selectedMediaId}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
