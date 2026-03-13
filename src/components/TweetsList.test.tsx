import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import TweetsList from './TweetsList';
import rootReducer from '../reducers';

// Mock uuid
jest.mock('uuid', () => ({
  v4: () => 'test-uuid-1234',
}));

// Mock moment completely to avoid locale issues
jest.mock('moment', () => {
  const actualMoment = jest.requireActual('moment');
  const mockMoment = (date?: string) => actualMoment(date);
  mockMoment.locale = jest.fn();
  Object.assign(mockMoment, actualMoment);
  return mockMoment;
});

// Mock moment/locale/es to prevent defineLocale errors
jest.mock('moment/locale/es', () => {});

const createMockStore = (tweets = []) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: {
      tweets: { list: tweets },
      modals: { isTweetModalOpen: false },
      validations: { tweet: false, author: false },
    },
  });
};

describe('TweetsList Component', () => {
  test('renders empty state when no tweets', () => {
    const store = createMockStore([]);
    render(
      <Provider store={store}>
        <TweetsList />
      </Provider>
    );

    const emptyMessage = screen.getByText(/no hay tweets aún/i);
    expect(emptyMessage).toBeInTheDocument();
  });

  test('renders tweet cards when tweets exist', () => {
    const mockTweets = [
      {
        id: '1',
        author: '@testuser',
        text: 'This is a test tweet',
        timestamp: '13-03-2026 12:00:00',
        likes: 5,
      },
    ];

    const store = createMockStore(mockTweets);
    render(
      <Provider store={store}>
        <TweetsList />
      </Provider>
    );

    expect(screen.getByText('@testuser')).toBeInTheDocument();
    expect(screen.getByText('This is a test tweet')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('like button increments likes count', () => {
    const mockTweets = [
      {
        id: '1',
        author: '@testuser',
        text: 'Test tweet',
        timestamp: '13-03-2026 12:00:00',
        likes: 0,
      },
    ];

    const store = createMockStore(mockTweets);
    render(
      <Provider store={store}>
        <TweetsList />
      </Provider>
    );

    const likeButton = screen.getByTitle(/Me gusta/i);
    fireEvent.click(likeButton);

    const state = store.getState();
    expect(state.tweets.list[0].likes).toBe(1);
  });

  test('renders multiple tweets', () => {
    const mockTweets = [
      {
        id: '1',
        author: '@user1',
        text: 'First tweet',
        timestamp: '13-03-2026 12:00:00',
        likes: 0,
      },
      {
        id: '2',
        author: '@user2',
        text: 'Second tweet',
        timestamp: '13-03-2026 13:00:00',
        likes: 3,
      },
    ];

    const store = createMockStore(mockTweets);
    render(
      <Provider store={store}>
        <TweetsList />
      </Provider>
    );

    expect(screen.getByText('@user1')).toBeInTheDocument();
    expect(screen.getByText('@user2')).toBeInTheDocument();
    expect(screen.getByText('First tweet')).toBeInTheDocument();
    expect(screen.getByText('Second tweet')).toBeInTheDocument();
  });

  test('renders action buttons for each tweet', () => {
    const mockTweets = [
      {
        id: '1',
        author: '@testuser',
        text: 'Test tweet',
        timestamp: '13-03-2026 12:00:00',
        likes: 0,
      },
    ];

    const store = createMockStore(mockTweets);
    render(
      <Provider store={store}>
        <TweetsList />
      </Provider>
    );

    expect(screen.getByTitle(/Me gusta/i)).toBeInTheDocument();
    expect(screen.getByTitle(/Editar/i)).toBeInTheDocument();
    expect(screen.getByTitle(/Eliminar/i)).toBeInTheDocument();
  });

  test('opens delete confirmation modal', () => {
    const mockTweets = [
      {
        id: '1',
        author: '@testuser',
        text: 'Test tweet',
        timestamp: '13-03-2026 12:00:00',
        likes: 0,
      },
    ];

    const store = createMockStore(mockTweets);
    render(
      <Provider store={store}>
        <TweetsList />
      </Provider>
    );

    const deleteButton = screen.getByTitle(/Eliminar/i);
    fireEvent.click(deleteButton);

    const confirmModal = screen.getByText(/Confirmar eliminación/i);
    expect(confirmModal).toBeInTheDocument();
  });

  test('opens edit modal', () => {
    const mockTweets = [
      {
        id: '1',
        author: '@testuser',
        text: 'Test tweet',
        timestamp: '13-03-2026 12:00:00',
        likes: 0,
      },
    ];

    const store = createMockStore(mockTweets);
    render(
      <Provider store={store}>
        <TweetsList />
      </Provider>
    );

    const editButton = screen.getByTitle(/Editar/i);
    fireEvent.click(editButton);

    const editModal = screen.getByText(/Editar Tweet/i);
    expect(editModal).toBeInTheDocument();
  });
});
