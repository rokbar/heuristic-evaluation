import {
  AUTH_USER,
  UNAUTH_USER,
} from '../actions/types';

export default (state = {}, action) => {
  switch(action.type) {
    case AUTH_USER: {
      const { role, name, authenticated, userId, companyId } = action.payload;
      return {
        ...state,
        authenticated,
        role,
        name,
        userId,
        companyId,
      };
    }
    case UNAUTH_USER:
      return { authenticated: false };
  }

  return state;
}
