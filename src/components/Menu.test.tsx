import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Menu from './Menu';
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
      validations: { tweet: false, author: false },
    },
  });
};

describe('Menu Component', () => {
  test('renders navbar with logo and title', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Menu />
      </Provider>
    );

    const title = screen.getByText(/Redux Tweets/i);
    expect(title).toBeInTheDocument();

    const logo = screen.getByAltText(/Redux Tweets Simulator/i);
    expect(logo).toBeInTheDocument();
  });

  test('renders floating new tweet button', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Menu />
      </Provider>
    );

    const button = screen.getByTitle(/Nuevo Tweet/i);
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-floating-new-tweet');
  });

  test('opens modal when new tweet button is clicked', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Menu />
      </Provider>
    );

    const initialState = store.getState().modals.isTweetModalOpen;
    expect(initialState).toBe(false);

    const button = screen.getByTitle(/Nuevo Tweet/i);
    fireEvent.click(button);

    const newState = store.getState().modals.isTweetModalOpen;
    expect(newState).toBe(true);
  });

  test('navbar brand is clickable', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Menu />
      </Provider>
    );

    const brandLink = screen.getByText(/Redux Tweets/i).closest('a');
    expect(brandLink).toHaveAttribute('href', '#home');
  });
});
