import {
  API_RESPONSE_MODAL_SHOW,
  API_RESPONSE_MODAL_CLOSE,
} from '../actions/types';

export const checkAPIResponseValidity = (response) =>
  (dispatch) => isResponseOK(response)
    ? response.json()
    : response.json()
      .then((resp) => dispatch(showAPIResponseError(resp)));

export const isResponseOK = (response) => (response && response.ok && (response.status >= 200 && response.status < 400));

export const showAPIResponseModal = ({type = 'info', message = ''}) => ({
  type: API_RESPONSE_MODAL_SHOW,
  payload: {
    isOpen: true,
    type,
    message,
  }
});

export const closeAPIResponseModal = () => ({type: API_RESPONSE_MODAL_CLOSE});

export const showAPIResponseError = ({message}) => showAPIResponseModal({type: 'error', message});
export const showAPIResponse = ({message}) => showAPIResponseModal({type: 'success', message});

