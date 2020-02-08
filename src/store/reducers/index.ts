import { combineReducers } from 'redux';
import connectionReducer from './connect.reducers';

const isElectronReducer = (state = Boolean(window.process)) => state;

export default combineReducers({
  connection: connectionReducer,
  isElectron: isElectronReducer,
});
