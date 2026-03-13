import React from 'react';
import { Container } from 'react-bootstrap';
import Menu from './components/Menu';
import Modal from './components/Modal';
import FormAddTweet from './components/FormAddTweet';
import TweetsList from './components/TweetsList';

// Redux
import store from './store';
import { Provider } from 'react-redux';

function App() {
  return (
    <Provider store={store}>
      <div className="app-container">
        <Menu />
        <Container className="py-4">
          <TweetsList />
        </Container>
        <Modal title="Nuevo Tweet">
          <FormAddTweet />
        </Modal>
      </div>
    </Provider>
  );
}

export default App;
