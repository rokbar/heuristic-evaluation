import {
  AUTH_USER,
  UNAUTH_USER,
} from '../actions/types';

export default (state = {}, action) => {
  switch(action.type) {
    case AUTH_USER: {
      const { role, authenticated } = action.payload;
      return { ...state, authenticated, role };
    }
    case UNAUTH_USER:
      return { authenticated: false };
  }

  return state;
}
