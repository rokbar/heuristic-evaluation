import {
  SET_USERS,
} from '../actions/types';

export default (state = [], action) => {
  switch(action.type) {
    case SET_USERS: {
      const { users } = action.payload;
      return [ ...users ];
    }
  }

  return state;
}
