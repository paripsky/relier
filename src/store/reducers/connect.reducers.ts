// @ts-nocheck
import {
  START_CONNECTING,
  CONNECTED,
  STREAMING,
  RECIEVING,
} from '../actions/connect.types';
import { combineReducers } from 'redux';

export const connecting = (state = false, { type, secret }) => {
  switch (type) {
    case START_CONNECTING:
      return true;
    case CONNECTED:
      return false;
    default:
      return state;
  }
};

export const connections = (state = [], { type, secret }) => {
  switch (type) {
    case CONNECTED:
      return [...state, { id: secret }];
    default:
      return state;
  }
};

export const isLoggedIn = (state = false, { type, secret }) => {
  switch (type) {
    case CONNECTED:
      return true;
    default:
      return state;
  }
};

export const streamId = (state = null, { type, streamId }) => {
  switch (type) {
    case STREAMING:
    case RECIEVING:
      return streamId;
    default:
      return state;
  }
};

export const secret = (state = null, { type, secret }) => {
  switch (type) {
    case CONNECTED:
      return secret;
    default:
      return state;
  }
};

export default combineReducers({
  connecting,
  connections,
  streamId,
  isLoggedIn,
  secret,
});
