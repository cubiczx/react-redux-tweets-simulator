// Define types
export interface Tweet {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  likes: number;
}

export interface TweetState {
  list: Tweet[];
}

export interface TweetAction {
  type: string;
  payload?: any;
}

// Define the initial state of the application
const initialState: TweetState = {
  list: []
};

// Define a reducer function to handle actions and update the state
function tweetsReducer(state = initialState, action: TweetAction): TweetState {
  switch (action.type) {
    case 'ADD_TWEET':
      return {
        ...state,
        list: [...state.list, action.payload]
      };
    case 'DELETE_TWEET':
      return {
        ...state,
        list: state.list.filter(tweet => tweet.id !== action.payload)
      };
    case 'LIKE_TWEET':
      return {
        ...state,
        list: state.list.map(tweet =>
          tweet.id === action.payload
            ? { ...tweet, likes: tweet.likes + 1 }
            : tweet
        )
      };
    case 'EDIT_TWEET':
      return {
        ...state,
        list: state.list.map(tweet =>
          tweet.id === action.payload.id
            ? { ...tweet, text: action.payload.text }
            : tweet
        )
      };
    default:
      return state;
  }
}

export default tweetsReducer;
