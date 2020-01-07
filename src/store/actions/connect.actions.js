import { CONNECTED, START_CONNECTING } from './connect.types';

export const startConnecting = id => ({ type: START_CONNECTING, id });
export const connected = id => ({ type: CONNECTED, id });

const fakeFetch = () => {
  return new Promise(resolve => {
    setTimeout(resolve, 3000);
  });
};

export const connectManually = id => {
  return async dispatch => {
    dispatch(startConnecting(id));
    await fakeFetch();
    dispatch(connected(id));
  };
};

export const connectUsingServer = id => {
  return async dispatch => {
    dispatch(startConnecting(id));
    await fakeFetch();
    dispatch(connected(id));
  };
};
