import { SET_USERS } from './types';
import { getJwtToken} from "utils/localStorage";

export function getUsers() {
  return (dispatch) => {
    return fetch('/users', {
      headers: {
        'Authorization': getJwtToken(),
      },
      method: 'GET',
    })
      .then(response => {
        dispatch({
          type: SET_USERS,
          payload: {
            users: response,
          },
        });
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      })
  }
}
