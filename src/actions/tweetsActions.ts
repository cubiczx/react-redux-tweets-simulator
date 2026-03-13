import { v4 as uuidv4 } from "uuid";
import moment from "moment";

// Export action type constants
export const ADD_TWEET = "ADD_TWEET";
export const DELETE_TWEET = "DELETE_TWEET";
export const LIKE_TWEET = "LIKE_TWEET";
export const EDIT_TWEET = "EDIT_TWEET";

export const addTweet = (name: string, tweet: string) => {
  return {
    type: ADD_TWEET,
    payload: {
      id: uuidv4(),
      text: tweet,
      author: name,
      timestamp: moment().format("DD-MM-YYYY HH:mm:ss"),
      likes: 0,
    },
  };
};

export const deleteTweet = (id: string) => {
  return {
    type: DELETE_TWEET,
    payload: id,
  };
};

export const likeTweet = (id: string) => {
  return {
    type: LIKE_TWEET,
    payload: id,
  };
};

export const editTweet = (id: string, text: string) => {
  return {
    type: EDIT_TWEET,
    payload: { id, text },
  };
};
