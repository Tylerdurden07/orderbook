import orderBookReducer from './orderBook/orderBook';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
    orderBook : orderBookReducer
});

export default rootReducer;