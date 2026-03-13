// Mock uuid before imports
jest.mock('uuid', () => ({
  v4: () => 'test-uuid-1234',
}));

import tweetsReducer, { TweetState } from './tweetsReducer';
import { ADD_TWEET, DELETE_TWEET, LIKE_TWEET, EDIT_TWEET } from '../actions/tweetsActions';

describe('tweetsReducer', () => {
  const initialState: TweetState = {
    list: [],
  };

  test('returns initial state when action type is unknown', () => {
    const action = { type: 'UNKNOWN_ACTION', payload: {} };
    const state = tweetsReducer(undefined, action as any);
    expect(state).toEqual(initialState);
  });

  describe('ADD_TWEET', () => {
    test('adds a tweet to empty list', () => {
      const newTweet = {
        id: '1',
        author: '@testuser',
        text: 'Test tweet',
        timestamp: '13-03-2026 12:00:00',
        likes: 0,
      };

      const action = {
        type: ADD_TWEET,
        payload: newTweet,
      };

      const newState = tweetsReducer(initialState, action);
      expect(newState.list).toHaveLength(1);
      expect(newState.list[0]).toEqual(newTweet);
    });

    test('adds a tweet to existing list', () => {
      const existingState: TweetState = {
        list: [
          {
            id: '1',
            author: '@user1',
            text: 'First tweet',
            timestamp: '13-03-2026 12:00:00',
            likes: 5,
          },
        ],
      };

      const newTweet = {
        id: '2',
        author: '@user2',
        text: 'Second tweet',
        timestamp: '13-03-2026 13:00:00',
        likes: 0,
      };

      const action = {
        type: ADD_TWEET,
        payload: newTweet,
      };

      const newState = tweetsReducer(existingState, action);
      expect(newState.list).toHaveLength(2);
      expect(newState.list[1]).toEqual(newTweet);
    });

    test('does not mutate original state', () => {
      const originalState: TweetState = {
        list: [
          {
            id: '1',
            author: '@user1',
            text: 'Original',
            timestamp: '13-03-2026 12:00:00',
            likes: 0,
          },
        ],
      };

      const newTweet = {
        id: '2',
        author: '@user2',
        text: 'New',
        timestamp: '13-03-2026 13:00:00',
        likes: 0,
      };

      const action = {
        type: ADD_TWEET,
        payload: newTweet,
      };

      tweetsReducer(originalState, action);
      expect(originalState.list).toHaveLength(1);
    });
  });

  describe('DELETE_TWEET', () => {
    test('deletes a tweet by id', () => {
      const state: TweetState = {
        list: [
          {
            id: '1',
            author: '@user1',
            text: 'Tweet 1',
            timestamp: '13-03-2026 12:00:00',
            likes: 0,
          },
          {
            id: '2',
            author: '@user2',
            text: 'Tweet 2',
            timestamp: '13-03-2026 13:00:00',
            likes: 0,
          },
        ],
      };

      const action = {
        type: DELETE_TWEET,
        payload: '1',
      };

      const newState = tweetsReducer(state, action);
      expect(newState.list).toHaveLength(1);
      expect(newState.list[0].id).toBe('2');
    });

    test('returns same state if tweet id not found', () => {
      const state: TweetState = {
        list: [
          {
            id: '1',
            author: '@user1',
            text: 'Tweet 1',
            timestamp: '13-03-2026 12:00:00',
            likes: 0,
          },
        ],
      };

      const action = {
        type: DELETE_TWEET,
        payload: 'non-existent-id',
      };

      const newState = tweetsReducer(state, action);
      expect(newState.list).toHaveLength(1);
    });

    test('does not mutate original state', () => {
      const originalState: TweetState = {
        list: [
          {
            id: '1',
            author: '@user1',
            text: 'Tweet',
            timestamp: '13-03-2026 12:00:00',
            likes: 0,
          },
        ],
      };

      const action = {
        type: DELETE_TWEET,
        payload: '1',
      };

      tweetsReducer(originalState, action);
      expect(originalState.list).toHaveLength(1);
    });
  });

  describe('LIKE_TWEET', () => {
    test('increments likes for the correct tweet', () => {
      const state: TweetState = {
        list: [
          {
            id: '1',
            author: '@user1',
            text: 'Tweet 1',
            timestamp: '13-03-2026 12:00:00',
            likes: 0,
          },
        ],
      };

      const action = {
        type: LIKE_TWEET,
        payload: '1',
      };

      const newState = tweetsReducer(state, action);
      expect(newState.list[0].likes).toBe(1);
    });

    test('increments likes multiple times', () => {
      let state: TweetState = {
        list: [
          {
            id: '1',
            author: '@user1',
            text: 'Tweet 1',
            timestamp: '13-03-2026 12:00:00',
            likes: 0,
          },
        ],
      };

      const action = {
        type: LIKE_TWEET,
        payload: '1',
      };

      state = tweetsReducer(state, action);
      state = tweetsReducer(state, action);
      state = tweetsReducer(state, action);

      expect(state.list[0].likes).toBe(3);
    });

    test('only increments likes for the specified tweet', () => {
      const state: TweetState = {
        list: [
          {
            id: '1',
            author: '@user1',
            text: 'Tweet 1',
            timestamp: '13-03-2026 12:00:00',
            likes: 5,
          },
          {
            id: '2',
            author: '@user2',
            text: 'Tweet 2',
            timestamp: '13-03-2026 13:00:00',
            likes: 3,
          },
        ],
      };

      const action = {
        type: LIKE_TWEET,
        payload: '1',
      };

      const newState = tweetsReducer(state, action);
      expect(newState.list[0].likes).toBe(6);
      expect(newState.list[1].likes).toBe(3);
    });

    test('does not mutate original state', () => {
      const originalState: TweetState = {
        list: [
          {
            id: '1',
            author: '@user1',
            text: 'Tweet',
            timestamp: '13-03-2026 12:00:00',
            likes: 5,
          },
        ],
      };

      const action = {
        type: LIKE_TWEET,
        payload: '1',
      };

      tweetsReducer(originalState, action);
      expect(originalState.list[0].likes).toBe(5);
    });
  });

  describe('EDIT_TWEET', () => {
    test('edits tweet text correctly', () => {
      const state: TweetState = {
        list: [
          {
            id: '1',
            author: '@user1',
            text: 'Original text',
            timestamp: '13-03-2026 12:00:00',
            likes: 5,
          },
        ],
      };

      const action = {
        type: EDIT_TWEET,
        payload: {
          id: '1',
          text: 'Edited text',
        },
      };

      const newState = tweetsReducer(state, action);
      expect(newState.list[0].text).toBe('Edited text');
      expect(newState.list[0].likes).toBe(5); // likes preserved
    });

    test('only edits the specified tweet', () => {
      const state: TweetState = {
        list: [
          {
            id: '1',
            author: '@user1',
            text: 'Tweet 1',
            timestamp: '13-03-2026 12:00:00',
            likes: 0,
          },
          {
            id: '2',
            author: '@user2',
            text: 'Tweet 2',
            timestamp: '13-03-2026 13:00:00',
            likes: 0,
          },
        ],
      };

      const action = {
        type: EDIT_TWEET,
        payload: {
          id: '1',
          text: 'Edited Tweet 1',
        },
      };

      const newState = tweetsReducer(state, action);
      expect(newState.list[0].text).toBe('Edited Tweet 1');
      expect(newState.list[1].text).toBe('Tweet 2');
    });

    test('returns same state if tweet id not found', () => {
      const state: TweetState = {
        list: [
          {
            id: '1',
            author: '@user1',
            text: 'Tweet 1',
            timestamp: '13-03-2026 12:00:00',
            likes: 0,
          },
        ],
      };

      const action = {
        type: EDIT_TWEET,
        payload: {
          id: 'non-existent-id',
          newText: 'Edited text',
        },
      };

      const newState = tweetsReducer(state, action);
      expect(newState.list[0].text).toBe('Tweet 1');
    });

    test('does not mutate original state', () => {
      const originalState: TweetState = {
        list: [
          {
            id: '1',
            author: '@user1',
            text: 'Original',
            timestamp: '13-03-2026 12:00:00',
            likes: 0,
          },
        ],
      };

      const action = {
        type: EDIT_TWEET,
        payload: {
          id: '1',
          newText: 'Edited',
        },
      };

      tweetsReducer(originalState, action);
      expect(originalState.list[0].text).toBe('Original');
    });
  });
});
