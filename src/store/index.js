import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './reducers';
import thunk from 'redux-thunk';

let enhancements;

if (window.__REDUX_DEVTOOLS_EXTENSION__) {
  enhancements = compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
} else {
  enhancements = applyMiddleware(thunk);
}

export default createStore(rootReducer, enhancements);
