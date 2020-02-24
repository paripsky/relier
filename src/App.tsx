import React from 'react';
import './App.css';
import { useSelector } from 'react-redux';

import {
  Box,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuGroup,
  MenuDivider,
  MenuList,
  MenuItem,
  Text,
} from '@chakra-ui/core';
import { RootState } from './store';
import useTheme from './useTheme';
import Login from './pages/Login';
import Host from './pages/Host';
import Streaming from './pages/Streaming';

function App() {
  const { bg, color, toggleTheme, primaryBg } = useTheme();

  const isLoggedIn = useSelector<RootState, boolean>(
    state => state.connection.isLoggedIn
  );

  const isRecieving = useSelector<RootState, boolean>(state => {
    return !!state.connection.streamId;
  });

  return (
    <Box className="App" fontFamily="Oswald">
      <header className="App-header">
        <Box bg={primaryBg} color={color} w="100%" p={2}>
          <Flex justify="space-between" alignItems="center">
            <Box color="white">
              <Text>unelap</Text>
            </Box>
            <Menu>
              <MenuButton as="div">
                <Icon name="settings" size="5" color="white" />
              </MenuButton>
              <MenuList minWidth="125px">
                <MenuGroup title="Profile">
                  <MenuItem>Login</MenuItem>
                  <MenuItem>My Account</MenuItem>
                </MenuGroup>
                <MenuDivider />
                <MenuItem onClick={toggleTheme}>Toggle Dark Mode</MenuItem>
                <MenuItem>Settings</MenuItem>
                <MenuItem>Quit</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Box>
      </header>
      <main>
        <Flex h="full" overflow="auto" bg={bg} color={color}>
          {/* <Sidebar /> */}
          {!isLoggedIn && <Login />}
          {isLoggedIn && !isRecieving && <Host />}
          {isLoggedIn && isRecieving && <Streaming />}
        </Flex>
      </main>
      <footer>
        <Box bg={bg} color={color}>
          <Text>unelap &copy; 2020</Text>
        </Box>
      </footer>
    </Box>
  );
}

export default App;
