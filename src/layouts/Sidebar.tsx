import React from 'react';
import { Box, Icon } from '@chakra-ui/core';
import useTheme from '../useTheme';

export default function Sidebar() {
  const { color } = useTheme();

  return (
    <Box
      as="aside"
      color={color}
      w={60}
      h="full"
      bg="teal.200"
      d="inline-flex"
      flexDirection="column"
      justifyContent="flex-end"
    >
      {['add', 'calendar', 'settings', 'search'].map(menuOption => (
        <Box
          h={45}
          d="flex"
          justifyContent="center"
          alignItems="center"
          cursor="pointer"
          key={menuOption}
        >
          <Icon name={menuOption as any} size="28px" />
        </Box>
      ))}
    </Box>
  );
}
