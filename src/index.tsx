import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import store from './store';
import { Provider as StoreProvider } from 'react-redux';
import {
  ThemeProvider,
  CSSReset,
  ColorModeProvider,
  theme as ChakraTheme,
} from '@chakra-ui/core';

document.title = 'unelap';

const theme = {
  ...ChakraTheme,
  fonts: {
    body: 'Open Sans',
    heading: 'Open Sans',
    mono: 'Open Sans',
  },
};

ReactDOM.render(
  <StoreProvider store={store}>
    <ThemeProvider theme={theme}>
      <CSSReset />
      <ColorModeProvider>
        <App />
      </ColorModeProvider>
    </ThemeProvider>
  </StoreProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// @ts-ignore
if (module?.hot) {
  // @ts-ignore
  module.hot.accept();
}

window.onerror = console.error;
