import { SAVE_ORDER_BOOK_DATA} from './types';

export const saveOrderBookData = (payload) => {
    return {
        type: SAVE_ORDER_BOOK_DATA,
        payload
    }
}


