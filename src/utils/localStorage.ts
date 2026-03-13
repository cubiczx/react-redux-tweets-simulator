import { Tweet } from '../reducers/tweetsReducer';

export const getTweetsStateFromLocalStorage = () => {
  try {
    const tweetsLocalStorageState = localStorage.getItem('tweets');
    if (tweetsLocalStorageState) {
      const parsed = JSON.parse(tweetsLocalStorageState);
      // Migrar datos antiguos: agregar campo likes si no existe
      if (parsed.list && Array.isArray(parsed.list)) {
        parsed.list = parsed.list.map((tweet: any) => ({
          ...tweet,
          likes: tweet.likes ?? 0,
        }));
        // Devolver en la estructura que espera el rootReducer
        // rootReducer espera: { tweets: TweetState }
        // donde TweetState = { list: Tweet[] }
        return {
          tweets: parsed, // parsed = { list: [...] }
        };
      }
    }
  } catch (error) {
    console.error('Error loading tweets from localStorage:', error);
    localStorage.removeItem('tweets');
  }
  return undefined;
};

export const saveTweetsStateToLocalStorage = (state: { list: Tweet[] }) => {
  localStorage.setItem("tweets", JSON.stringify(state));
};