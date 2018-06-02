import {
  API_RESPONSE_MODAL_SHOW,
  API_RESPONSE_MODAL_CLOSE,
} from '../actions/types';

export const showAPIResponseModal = ({type = 'info', message = ''}) => ({
  type: API_RESPONSE_MODAL_SHOW,
  payload: {
    isOpen: true,
    type,
    message,
  }
});

export const closeAPIResponseModal = () => ({type: API_RESPONSE_MODAL_CLOSE});

export const showAPIResponseError = (message) => showAPIResponseModal({type: 'error', message});
export const showAPIResponse = (message) => showAPIResponseModal({type: 'success', message});

