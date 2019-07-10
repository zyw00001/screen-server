import { combineReducers } from 'redux';
import {createReducer} from './action-reducer/reducer';

const reducers = combineReducers({
  home: createReducer(['home'], null, {users: [], checked: []}),
  screens: createReducer(['screens'])
});

export default reducers;