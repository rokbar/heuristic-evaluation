import {
  EDIT_FORM,
} from '../actions/types';

export default (state = {}, action) => {
  switch(action.type) {
    case EDIT_FORM: {
      return { data: action.payload }
    }
  }

  return state;
}
