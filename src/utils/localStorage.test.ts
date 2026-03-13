import { getTweetsStateFromLocalStorage, saveTweetsStateToLocalStorage } from './localStorage';

describe('localStorage utilities', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('getTweetsStateFromLocalStorage', () => {
    test('returns undefined when localStorage is empty', () => {
      const result = getTweetsStateFromLocalStorage();
      expect(result).toBeUndefined();
    });

    test('returns tweets state when valid data exists', () => {
      const mockTweets = {
        list: [
          {
            id: '1',
            author: '@testuser',
            text: 'Test tweet',
            timestamp: '13-03-2026 12:00:00',
            likes: 5,
          },
        ],
      };

      localStorage.setItem('tweets', JSON.stringify(mockTweets));

      const result = getTweetsStateFromLocalStorage();
      expect(result).toEqual({ tweets: mockTweets });
    });

    test('migrates old tweets without likes field', () => {
      const oldTweets = {
        list: [
          {
            id: '1',
            author: '@testuser',
            text: 'Old tweet without likes',
            timestamp: '13-03-2026 12:00:00',
          },
        ],
      };

      localStorage.setItem('tweets', JSON.stringify(oldTweets));

      const result = getTweetsStateFromLocalStorage();
      expect(result?.tweets.list[0].likes).toBe(0);
    });

    test('preserves existing likes count during migration', () => {
      const tweets = {
        list: [
          {
            id: '1',
            author: '@testuser',
            text: 'Tweet with likes',
            timestamp: '13-03-2026 12:00:00',
            likes: 10,
          },
        ],
      };

      localStorage.setItem('tweets', JSON.stringify(tweets));

      const result = getTweetsStateFromLocalStorage();
      expect(result?.tweets.list[0].likes).toBe(10);
    });

    test('handles multiple tweets correctly', () => {
      const mockTweets = {
        list: [
          {
            id: '1',
            author: '@user1',
            text: 'First tweet',
            timestamp: '13-03-2026 12:00:00',
            likes: 3,
          },
          {
            id: '2',
            author: '@user2',
            text: 'Second tweet',
            timestamp: '13-03-2026 13:00:00',
            likes: 7,
          },
        ],
      };

      localStorage.setItem('tweets', JSON.stringify(mockTweets));

      const result = getTweetsStateFromLocalStorage();
      expect(result?.tweets.list).toHaveLength(2);
      expect(result?.tweets.list[0].author).toBe('@user1');
      expect(result?.tweets.list[1].author).toBe('@user2');
    });

    test('returns undefined and clears storage on invalid JSON', () => {
      localStorage.setItem('tweets', 'invalid json data');

      const result = getTweetsStateFromLocalStorage();
      expect(result).toBeUndefined();
      expect(localStorage.getItem('tweets')).toBeNull();
    });

    test('returns undefined when data structure is invalid', () => {
      localStorage.setItem('tweets', JSON.stringify({ invalid: 'structure' }));

      const result = getTweetsStateFromLocalStorage();
      expect(result).toBeUndefined();
    });

    test('handles empty list correctly', () => {
      const emptyTweets = { list: [] };
      localStorage.setItem('tweets', JSON.stringify(emptyTweets));

      const result = getTweetsStateFromLocalStorage();
      expect(result).toEqual({ tweets: { list: [] } });
    });
  });

  describe('saveTweetsStateToLocalStorage', () => {
    test('saves tweets state to localStorage', () => {
      const mockState = {
        list: [
          {
            id: '1',
            author: '@testuser',
            text: 'Test tweet',
            timestamp: '13-03-2026 12:00:00',
            likes: 5,
          },
        ],
      };

      saveTweetsStateToLocalStorage(mockState);

      const stored = localStorage.getItem('tweets');
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored!)).toEqual(mockState);
    });

    test('overwrites existing data', () => {
      const oldState = {
        list: [
          {
            id: '1',
            author: '@olduser',
            text: 'Old tweet',
            timestamp: '13-03-2026 11:00:00',
            likes: 2,
          },
        ],
      };

      const newState = {
        list: [
          {
            id: '2',
            author: '@newuser',
            text: 'New tweet',
            timestamp: '13-03-2026 12:00:00',
            likes: 8,
          },
        ],
      };

      saveTweetsStateToLocalStorage(oldState);
      saveTweetsStateToLocalStorage(newState);

      const stored = localStorage.getItem('tweets');
      const parsed = JSON.parse(stored!);
      expect(parsed.list[0].author).toBe('@newuser');
    });

    test('saves empty list correctly', () => {
      const emptyState = { list: [] };

      saveTweetsStateToLocalStorage(emptyState);

      const stored = localStorage.getItem('tweets');
      expect(JSON.parse(stored!)).toEqual({ list: [] });
    });

    test('saves multiple tweets correctly', () => {
      const multipleState = {
        list: [
          {
            id: '1',
            author: '@user1',
            text: 'First',
            timestamp: '13-03-2026 12:00:00',
            likes: 1,
          },
          {
            id: '2',
            author: '@user2',
            text: 'Second',
            timestamp: '13-03-2026 13:00:00',
            likes: 2,
          },
          {
            id: '3',
            author: '@user3',
            text: 'Third',
            timestamp: '13-03-2026 14:00:00',
            likes: 3,
          },
        ],
      };

      saveTweetsStateToLocalStorage(multipleState);

      const stored = localStorage.getItem('tweets');
      const parsed = JSON.parse(stored!);
      expect(parsed.list).toHaveLength(3);
    });
  });

  describe('Integration tests', () => {
    test('save and load cycle maintains data integrity', () => {
      const originalState = {
        list: [
          {
            id: '1',
            author: '@testuser',
            text: 'Test tweet',
            timestamp: '13-03-2026 12:00:00',
            likes: 5,
          },
        ],
      };

      saveTweetsStateToLocalStorage(originalState);
      const loadedState = getTweetsStateFromLocalStorage();

      expect(loadedState?.tweets).toEqual(originalState);
    });

    test('multiple save/load cycles work correctly', () => {
      const state1 = {
        list: [
          {
            id: '1',
            author: '@user1',
            text: 'First',
            timestamp: '13-03-2026 12:00:00',
            likes: 1,
          },
        ],
      };

      const state2 = {
        list: [
          ...state1.list,
          {
            id: '2',
            author: '@user2',
            text: 'Second',
            timestamp: '13-03-2026 13:00:00',
            likes: 2,
          },
        ],
      };

      saveTweetsStateToLocalStorage(state1);
      let loaded = getTweetsStateFromLocalStorage();
      expect(loaded?.tweets.list).toHaveLength(1);

      saveTweetsStateToLocalStorage(state2);
      loaded = getTweetsStateFromLocalStorage();
      expect(loaded?.tweets.list).toHaveLength(2);
    });
  });
});
