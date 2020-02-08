// @ts-nocheck
import {
  START_CONNECTING,
  CONNECTED,
  STREAMING,
} from '../actions/connect.types';
import { combineReducers } from 'redux';

export const connecting = (state = false, { type, id }) => {
  switch (type) {
    case START_CONNECTING:
      return true;
    case CONNECTED:
      return false;
    default:
      return state;
  }
};

export const connections = (state = [], { type, id }) => {
  switch (type) {
    case CONNECTED:
      return [...state, { id }];
    default:
      return state;
  }
};

export const streamId = (state = null, { type, streamId }) => {
  switch (type) {
    case STREAMING:
      return streamId;
    default:
      return state;
  }
};

export default combineReducers({ connecting, connections, streamId });
