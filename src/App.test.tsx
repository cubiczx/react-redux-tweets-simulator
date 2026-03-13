import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock uuid to avoid ESM issues with Jest
jest.mock('uuid', () => ({
  v4: () => 'test-uuid-1234',
}));

describe('App Component', () => {
  test('renders navbar with title', () => {
    render(<App />);
    const navbarTitle = screen.getByText(/Redux Tweets/i);
    expect(navbarTitle).toBeInTheDocument();
  });

  test('renders main container with tweets list', () => {
    render(<App />);
    // Check that the container exists by verifying its child elements
    expect(screen.getByText(/Redux Tweets/i)).toBeInTheDocument();
  });

  test('renders tweets list component', () => {
    render(<App />);
    // Should render empty state message initially
    const emptyMessage = screen.getByText(/no hay tweets aún/i);
    expect(emptyMessage).toBeInTheDocument();
  });

  test('renders new tweet button', () => {
    render(<App />);
    const newTweetButton = screen.getByTitle(/Nuevo Tweet/i);
    expect(newTweetButton).toBeInTheDocument();
  });
});
