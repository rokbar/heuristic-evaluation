import {
  SET_COMPANIES,
} from '../actions/types';

export default (state = [], action) => {
  switch(action.type) {
    case SET_COMPANIES: {
      const { companies } = action.payload;
      return [ ...companies ];
    }
  }

  return state;
}
