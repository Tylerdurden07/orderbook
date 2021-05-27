import { SAVE_ORDER_BOOK_DATA} from '../../actions/types';

const initialState = {
    psnap: {},
    mcnt: 0,
    bids : {},
    asks: {},
}
const orderBookReducer = (state = initialState, action) => {
    switch(action.type){
        case SAVE_ORDER_BOOK_DATA:
            return {
                ...action.payload
            }
        
        default:
            return state;
    }
}

export default orderBookReducer;