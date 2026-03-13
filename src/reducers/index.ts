import { combineReducers } from "redux";
import modalsReducer from "./modalsReducer";
import tweetsReducer from "./tweetsReducer";
import validationsReducer from "./validationsReducer";

const rootReducer = combineReducers({
    modals: modalsReducer,
    tweets: tweetsReducer,
    validations: validationsReducer,
});

export default rootReducer;