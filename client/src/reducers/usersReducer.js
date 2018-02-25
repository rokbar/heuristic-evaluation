import { filter } from 'lodash';
import {
  SET_USERS,
  DELETE_USER,
} from '../actions/types';

export default (state = [], action) => {
  switch(action.type) {
    case SET_USERS: {
      const { users } = action.payload;
      return [ ...users ];
    }
    case DELETE_USER: {
      const user = action.payload;
      return filter(state, (item) => item.id === user.id);
    }
  }

  return state;
}
