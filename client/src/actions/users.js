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
        return response.json()
      })
      .then(users => {
        dispatch({
          type: SET_USERS,
          payload: { users }
        });
      })
      .catch(error => {
        console.log(error);
      })
  }
}

export function addUser({ name, password, email, userId: systemAdminId }) {
  return (dispatch) => {
    return fetch('/users', {
      body: {
        name,
        password,
        email,
        'fk_SystemAdminid_User': systemAdminId,
      },
      headers: {
        'Authorization': getJwtToken(),
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  }
}
