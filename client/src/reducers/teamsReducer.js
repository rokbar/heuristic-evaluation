import {
  SET_TEAMS,
} from '../actions/types';

export default (state = [], action) => {
  switch(action.type) {
    case SET_TEAMS: {
      const { teams } = action.payload;
      return [ ...teams ];
    }
  }

  return state;
}
