import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import FormAddTweet from './FormAddTweet';
import rootReducer from '../reducers';

// Mock uuid
jest.mock('uuid', () => ({
  v4: () => 'test-uuid-1234',
}));

const createMockStore = () => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: {
      tweets: { list: [] },
      modals: { isTweetModalOpen: false },
      validations: { errorFormAddTweet: false },
    },
  });
};

describe('FormAddTweet Component', () => {
  test('renders form with author and tweet inputs', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <FormAddTweet />
      </Provider>
    );

    expect(screen.getByPlaceholderText(/@tu_usuario/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Tweetea algo/i)).toBeInTheDocument();
  });

  test('renders submit button', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <FormAddTweet />
      </Provider>
    );

    const submitButton = screen.getByRole('button', { name: /Publicar/i });
    expect(submitButton).toBeInTheDocument();
  });

  test('author input automatically adds @ prefix', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <FormAddTweet />
      </Provider>
    );

    const authorInput = screen.getByPlaceholderText(/@tu_usuario/i) as HTMLInputElement;
    fireEvent.change(authorInput, { target: { value: 'testuser' } });

    expect(authorInput.value).toBe('@testuser');
  });

  test('author input preserves @ if already present', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <FormAddTweet />
      </Provider>
    );

    const authorInput = screen.getByPlaceholderText(/@tu_usuario/i) as HTMLInputElement;
    fireEvent.change(authorInput, { target: { value: '@testuser' } });

    expect(authorInput.value).toBe('@testuser');
  });

  test('shows validation error when submitting empty form', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <FormAddTweet />
      </Provider>
    );

    const submitButton = screen.getByRole('button', { name: /Publicar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.validations.errorFormAddTweet).toBe(true);
    });
  });

  test('tweet input updates state correctly', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <FormAddTweet />
      </Provider>
    );

    const tweetInput = screen.getByPlaceholderText(/Tweetea algo/i) as HTMLTextAreaElement;
    fireEvent.change(tweetInput, { target: { value: 'This is my test tweet!' } });

    expect(tweetInput.value).toBe('This is my test tweet!');
  });

  test('submitting valid form adds tweet to store', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <FormAddTweet />
      </Provider>
    );

    const authorInput = screen.getByPlaceholderText(/@tu_usuario/i);
    const tweetInput = screen.getByPlaceholderText(/Tweetea algo/i);
    const submitButton = screen.getByRole('button', { name: /Publicar/i });

    fireEvent.change(authorInput, { target: { value: '@testuser' } });
    fireEvent.change(tweetInput, { target: { value: 'This is a test tweet' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.tweets.list).toHaveLength(1);
    });
    
    const state = store.getState();
    expect(state.tweets.list[0].author).toBe('@testuser');
    expect(state.tweets.list[0].text).toBe('This is a test tweet');
  });

  test('form clears after successful submission', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <FormAddTweet />
      </Provider>
    );

    const authorInput = screen.getByPlaceholderText(/@tu_usuario/i) as HTMLInputElement;
    const tweetInput = screen.getByPlaceholderText(/Tweetea algo/i) as HTMLTextAreaElement;
    const submitButton = screen.getByRole('button', { name: /Publicar/i });

    fireEvent.change(authorInput, { target: { value: '@testuser' } });
    fireEvent.change(tweetInput, { target: { value: 'This is a test tweet' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authorInput.value).toBe('@');
    });
    expect(tweetInput.value).toBe('');
  });

  test('validation errors clear when valid input is provided', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <FormAddTweet />
      </Provider>
    );

    const submitButton = screen.getByRole('button', { name: /Publicar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.validations.errorFormAddTweet).toBe(true);
    });

    const authorInput = screen.getByPlaceholderText(/@tu_usuario/i);
    const tweetInput = screen.getByPlaceholderText(/Tweetea algo/i);
    
    fireEvent.change(authorInput, { target: { value: '@testuser' } });
    fireEvent.change(tweetInput, { target: { value: 'Valid tweet content' } });

    // Submit again with valid data
    fireEvent.click(submitButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.validations.errorFormAddTweet).toBe(false);
    });
  });
});
