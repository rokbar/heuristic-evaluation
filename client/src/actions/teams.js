import {
  SET_TEAMS,
  SET_USERS,
  EDIT_FORM,
} from './types';
import { getJwtToken} from "utils/localStorage";

export function getTeamsByCompanyAdmin() {
  return (dispatch, getState) => {
    const { userId } = getState().auth;
    return fetch(`/teams?companyAdminId=${userId}`, {
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
          payload: { teams },
        });
        console.log(teams);
      })
      .catch(error => {
        console.log(error);
      })
  }
}

export function getTeamById({ teamId, formName = '' }) {
  return (dispatch) => {
    return fetch(`/teams?id=${teamId}`, {
      headers: {
        'Authorization': getJwtToken(),
      },
      method: 'GET',
    })
      .then(response => {
        return response.json()
      })
      .then(teams => {
        teams.length && dispatch({
          type: EDIT_FORM,
          formName,
          payload: { ...teams[0] }
        });
        return teams[0];
      })
      .catch(error => {
        console.log(error);
      })
  }
}

export function addTeam({ name, systemName, systemUrl, systemContacts }) {
  return (dispatch, getState) => {
    const { userId } = getState().auth;
    return fetch('/teams', {
      body: JSON.stringify({
        name,
        systemName,
        systemUrl,
        systemContacts,
        companyAdminId: userId,
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
      .then(teams => {
        console.log(teams);
      })
      .catch(error => {
        console.log(error);
      });
  }
}

export function editTeam({ id, name, systemName, systemUrl, systemContacts, leaderId }) {
  return (dispatch) => {
    return fetch(`/teams?id=${id}`, {
      body: JSON.stringify({
        name,
        systemName,
        systemUrl,
        systemContacts,
        leaderId,
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
      .then(teams => {
        console.log(teams);
      })
      .catch(error => {
        console.log(error);
      });
  }
}

export function getUsersByTeam({ teamId }) {
  return (dispatch) => {
    return fetch(`/teams/${teamId}/users`, {
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
            usersType: 'teamUsers',
            users,
          }
        })
      })
      .catch(error => {
        console.log(error);
      })
  }
}

export function startEvaluation({ plan = '', heuristicName, rules = null, heuristicId = null, teamId }) {
  return (dispatch) => {
    return fetch(`/teams/${teamId}/startEvaluation`, {
      body: JSON.stringify({
        plan,
        heuristicName,
        customHeuristics: rules,
        heuristicId,
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
      .then(teams => {
        console.log(teams);
      })
      .catch(error => {
        console.log(error);
      });
  }
}

export function startGeneralization({ teamId }) {
  return (dispatch) => {
    return fetch(`/teams/${teamId}/startGeneralization`, {
      headers: {
        'Authorization': getJwtToken(),
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
      .then(response => {
        return response.json();
      })
      .then(teams => {
        console.log(teams);
      })
      .catch(error => {
        console.log(error);
      });
  }
}

export function finishGeneralization({ teamId }) {
  return fetch(`/teams/${teamId}/finishGeneralization`, {
    headers: {
      'Authorization': getJwtToken(),
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
    .then(response => {
      return response.json();
    })
    .then(teams => {
      console.log(teams);
    })
    .catch(error => {
      console.log(error);
    });
}

export function finishRating({ teamId }) {
  return fetch(`/teams/${teamId}/finishRating`, {
    headers: {
      'Authorization': getJwtToken(),
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
    .then(response => {
      return response.json();
    })
    .then(teams => {
      console.log(teams);
    })
    .catch(error => {
      console.log(error);
    });
}
