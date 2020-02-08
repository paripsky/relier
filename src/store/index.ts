import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './reducers';
import thunk from 'redux-thunk';

let enhancements;

const reduxDevtoolsExtension = (window as any).__REDUX_DEVTOOLS_EXTENSION__;

if (reduxDevtoolsExtension) {
  enhancements = compose(
    applyMiddleware(thunk),
    reduxDevtoolsExtension && reduxDevtoolsExtension()
  );
} else {
  enhancements = applyMiddleware(thunk);
}

export type RootState = ReturnType<typeof rootReducer>;

export default createStore(rootReducer, enhancements);
