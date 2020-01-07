import React, { useCallback } from 'react';
import './App.css';
import './theme.scss';
import Button from './components/Button';
import { useDispatch } from 'react-redux';
import { connectManually } from './store/actions/connect.actions';
import Container from './components/Container';
import Input from './components/Input';

function App() {
  const dispatch = useDispatch();
  const id = 12;
  const connect = useCallback(() => {
    dispatch(connectManually(id));
  }, [dispatch, id]);

  return (
    <div className="App">
      <header className="App-header">
        <span>dechat</span>
      </header>
      <main>
        <Container direction="column" justify="center" fillHeight>
          <Input placeholder="enter a key that only your chat partner will know" />
          <Container>
            <Button onClick={connect}>connect manually</Button>
            <Button varient="outline">connect using a server</Button>
          </Container>
        </Container>
      </main>
      <footer>dechat &copy; 2020</footer>
    </div>
  );
}

export default App;
