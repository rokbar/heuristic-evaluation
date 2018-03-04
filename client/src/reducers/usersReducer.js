import { filter } from 'lodash';
import {
  SET_USERS,
  ADD_USER,
  DELETE_USER,
} from '../actions/types';

export default (state = {}, action) => {
  switch(action.type) {
    case SET_USERS: {
      const { users, usersType } = action.payload;
      return {
        ...state,
        [usersType]: [...users],
      };
    }
    case ADD_USER: {
      const { user, usersType } = action.payload;
      return {
        ...state,
        [usersType]: [user, ...state[usersType]],
      }
    }
    case DELETE_USER: {
      const { userId, usersType } = action.payload;
      const filteredUsers = filter(state[usersType], (item) => item.id !== userId);
      return {
        ...state,
        [usersType]: filteredUsers,
      }
    }
  }

  return state;
}
