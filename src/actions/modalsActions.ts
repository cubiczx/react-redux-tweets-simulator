export const setTweetModalToggle = (isOpen: boolean) => ({
  type: "SET_TWEET_MODAL_TOGGLE",
  payload: isOpen,
});

export const hideModal = () => ({
  type: "SET_TWEET_MODAL_TOGGLE",
  payload: false,
});