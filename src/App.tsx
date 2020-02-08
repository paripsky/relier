import React, { useRef } from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { connectAction, hostAction } from './store/actions/connect.actions';

import {
  Box,
  Flex,
  Avatar,
  Menu,
  MenuButton,
  MenuGroup,
  MenuDivider,
  MenuList,
  MenuItem,
} from '@chakra-ui/core';
import { RootState } from './store';
import useTheme from './useTheme';
import Login from './pages/Login';
import Sidebar from './layouts/Sidebar';
import Host from './pages/Host';

function App() {
  const dispatch = useDispatch();
  const remoteStream = useRef<HTMLVideoElement>(null);
  const { bg, color, toggleTheme, primaryBg } = useTheme();

  const stream = useSelector<RootState, MediaStream>(state => {
    if (state.connection.streamId) {
      const streamId = state.connection.streamId;
      const stream = (window as any)['streams'][streamId];
      console.log(remoteStream.current, stream);

      return stream;
    }
  });

  // const isElectron = useSelector<RootState, boolean>(state => {
  //   return state.isElectron;
  // });

  // if (stream && remoteStream.current) {
  //   remoteStream.current.srcObject = stream;
  // }

  // const connect = () => {
  //   dispatch(connectAction(secret, ''));
  // };

  // const host = () => {
  //   dispatch(hostAction(secret));
  // };

  return (
    <div className="App">
      <header className="App-header">
        <Box bg={primaryBg} color={color} w="100%" p={3}>
          <Flex justify="space-between" alignItems="center">
            <Box color="white">unelap</Box>
            <Menu>
              <MenuButton as="div">
                <Avatar size="md" />
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
        <Flex h="full">
          {/* <Sidebar /> */}
          <Login />
          <Host />
        </Flex>
      </main>
      <footer>
        <Box bg={bg} color={color}>
          unelap &copy; 2020
        </Box>
      </footer>
    </div>
  );
}

export default App;
