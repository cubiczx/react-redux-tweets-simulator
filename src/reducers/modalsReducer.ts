const initialProps = {
    isTweetModalOpen: false,
}

export default function modalsReducer(state = initialProps, action: any) {
    switch (action.type) {
        case 'SET_TWEET_MODAL_TOGGLE':
            return {
                ...state,
                isTweetModalOpen: action.payload,
            }
        default:
            return state;
    }
}