import {
  SET_TEAM_STATES,
} from '../actions/types';

export default (state = [], action) => {
  switch(action.type) {
    case SET_TEAM_STATES: {
      const { teamStates } = action.payload;
      return [ ...teamStates ];
    }
  }

  return state;
}
