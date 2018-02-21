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

export function addUser({ name, password, email }) {
  return (dispatch, getState) => {
    console.log(getState());
    const { userId } = getState().auth;
    return fetch('/users', {
      body: JSON.stringify({
        name,
        password,
        email,
        'fk_SystemAdminid_User': userId,
      }),
      headers: {
        'Authorization': getJwtToken(),
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
      .then(response => {
        return response.json();
      })
      .then(users => {
        console.log(users);
      })
      .catch(error => {
        console.log(error);
      });
  }
}
