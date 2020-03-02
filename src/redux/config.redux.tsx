import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk';

import ReminderReducer from "./reminder/reducer.redux";
import { IReminderStore } from "./reminder/store.redux";

export const rootReducer = combineReducers({
    reminderStore: ReminderReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;

export type Store = { reminderStore: IReminderStore };
