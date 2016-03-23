/**
 * Created by kascode on 20.02.16.
 */

import { createStore } from 'redux';
import reducer from '../reducers/transport';

export default createStore(reducer); // Optional second parameter can hold initial state from server