import {
  SET_USERS,
  DELETE_USER,
  EDIT_FORM
} from './types';
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
          payload: { users },
        });
        console.log(users);
      })
      .catch(error => {
        console.log(error);
      })
  }
}

export function getUserById({ userId }) {
  return (dispatch) => {
    return fetch(`/users?id=${userId}`, {
      headers: {
        'Authorization': getJwtToken(),
      },
      method: 'GET',
    })
      .then(response => {
        return response.json()
      })
      .then(users => {
        users.length && dispatch({
          type: EDIT_FORM,
          payload: { ...users[0] }
        });
      })
      .catch(error => {
        console.log(error);
      })
  }
}

export function getUsersByCompanyId() {
  return (dispatch, getState) => {
    const { companyId } = getState().auth;
    return fetch(`/users?company_id=${companyId}`, {
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
          payload: { users },
        });
        console.log(users);
      })
      .catch(error => {
        console.log(error);
      })
  }
}

export function addUser({ name, password, email, company, role }) {
  return (dispatch, getState) => {
    const { userId } = getState().auth;
    return fetch('/users', {
      body: JSON.stringify({
        name,
        password,
        email,
        role,
        lastLogon: new Date().toISOString().slice(0, 19).replace('T', ' '),
        company_id: company,
        systemAdmin_id: userId,
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

export function editUser({ id, name, email, company_id, role }) {
  return (dispatch) => {
    return fetch(`/users?id=${id}`, {
      body: JSON.stringify({
        name,
        email,
        role,
        company_id,
      }),
      headers: {
        'Authorization': getJwtToken(),
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
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

export function removeUser(id) {
  return (dispatch) => {
    return fetch(`/users?id=${id}`, {
      headers: {
        'Authorization': getJwtToken(),
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    })
      .then(response => {
        return response.json();
      })
      .then(users => {
        users.length && dispatch({
          type: DELETE_USER,
          payload: users[0],
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
}
