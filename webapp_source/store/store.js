/**
 * Created by kascode on 03.12.15.
 */
import { createStore } from 'redux';
import reducer from '../reducers/index';

export default createStore(reducer); // Optional second parameter can hold initial state from server