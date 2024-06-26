import {
  SET_USERS,
  DELETE_USER,
  EDIT_FORM,
  SET_TEAMS,
} from './types';
import {getJwtToken} from "utils/localStorage";
import {showAPIResponseError, checkAPIResponseValidity} from './apiResponse';

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
          payload: {
            usersType: 'all',
            users,
          },
        });
        console.log(users);
      })
      .catch(error => {
        console.log(error);
      })
  }
}

export function getUserById({userId, formName = ''}) {
  return (dispatch) => {
    return fetch(`/users/${userId}`, {
      headers: {
        'Authorization': getJwtToken(),
      },
      method: 'GET',
    })
      .then(response => dispatch(checkAPIResponseValidity(response)))
      .then(user => user && dispatch({
          type: EDIT_FORM,
          formName,
          payload: {...user}
        })
      )
      .catch(error => dispatch(showAPIResponseError({
        message: 'Neapdorota klaida bandant gauti informaciją apie naudotoją.'
      })));
  }
}

export function getUsersByCompanyId() {
  return (dispatch, getState) => {
    const {companyId} = getState().auth;
    return fetch(`/users?companyId=${companyId}`, {
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
          payload: {
            usersType: 'companyUsers',
            users,
          },
        });
        console.log(users);
      })
      .catch(error => {
        console.log(error);
      })
  }
}

export function addUser({name, password, email, company, role}) {
  return (dispatch, getState) => {
    const {userId} = getState().auth;
    return fetch('/users', {
      body: JSON.stringify({
        name,
        password,
        email,
        role,
        lastLogon: new Date().toISOString().slice(0, 19).replace('T', ' '),
        companyId: company,
        systemAdminId: userId,
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

export function editUser({id, name, email, companyId, role}) {
  return (dispatch) => {
    return fetch(`/users?id=${id}`, {
      body: JSON.stringify({
        name,
        email,
        role,
        companyId,
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

export function editAccount({id, name, email, password = ''}) {
  return (dispatch) => {
    return fetch(`/users/${id}/editAccount`, {
      body: JSON.stringify({
        name,
        email,
        password,
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

export function editPassword({id, currentPassword, newPassword, confirmPassword}) {
  return (dispatch) => {
    return fetch(`/users/${id}/changePassword`, {
      body: JSON.stringify({
        currentPassword,
        newPassword,
        confirmPassword,
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
          payload: {
            usersType: 'all',
            userId: users[0] && users[0].id,
          },
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
}

export function getTeamsByUser() {
  return (dispatch, getState) => {
    const {userId} = getState().auth;
    return fetch(`/users/${userId}/teams`, {
      headers: {
        'Authorization': getJwtToken(),
      },
      method: 'GET',
    })
      .then(response => {
        return response.json()
      })
      .then(teams => {
        dispatch({
          type: SET_TEAMS,
          payload: {teams}
        })
      })
      .catch(error => {
        console.log(error);
      })
  }
}
