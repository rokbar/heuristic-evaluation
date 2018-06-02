import {
  API_RESPONSE_MODAL_SHOW,
  API_RESPONSE_MODAL_CLOSE,
} from '../actions/types';

const initialState = {
  isOpen: false,
  type: 'info',
  message: '',
};

export default (state = {...initialState}, action) => {
  switch (action.type) {
    case API_RESPONSE_MODAL_SHOW: {
      return {
        isOpen: true,
        type: action.payload.type,
        message: action.payload.message,
      }
    }
    case API_RESPONSE_MODAL_CLOSE: {
      return {
        isOpen: false,
        type: '',
        message: '',
      }
    }
  }

  return state;
}
