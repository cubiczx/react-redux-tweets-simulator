const initialProps = {
    errorFormAddTweet: false
}

export default function validationsReducer(state = initialProps, action: any) {
    switch (action.type) {
        case 'SET_ERROR_FORM_ADD_TWEET':
            return {
                ...state,
                errorFormAddTweet: action.payload
            }
        default:
            return state;
    }
}