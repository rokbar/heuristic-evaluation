import {
  DESTROY_FORM,
  EDIT_FORM,
} from '../actions/types';

export default (state = {}, action) => {
  switch(action.type) {
    case EDIT_FORM: {
      return {
        ...state,
        [action.formName]: {
          data: action.payload,
        }
      };
    }
    case DESTROY_FORM: {
      return {};
    }
  }

  return state;
}
