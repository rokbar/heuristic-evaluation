import {ADD_USER, DELETE_USER} from './types';
import { getJwtToken } from 'utils/localStorage';
import { evaluatorTeamState } from 'utils/enums';

export function addUserToTeam({ evaluatorId: userId, teamId: teamId }) {
  return (dispatch) => {
    return fetch('/evaluatorteam', {
      body: JSON.stringify({
        evaluatorId: userId,
        teamId: teamId,
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
      .then(userTeam => {
        console.log(userTeam);
        const { user, ...data } = userTeam;
        dispatch({
          type: ADD_USER,
          payload: {
            usersType: 'teamUsers',
            user,
          }
        })
      })
      .catch(error => {
        console.log(error);
      });
  }
}

export function removeUserFromTeam({ userId, teamId }) {
  return (dispatch) => {
    return fetch(`/evaluatorteam?evaluatorId=${userId}&teamId=${teamId}`, {
      headers: {
        'Authorization': getJwtToken(),
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    })
      .then(response => {
        return response.json();
      })
      .then(userTeam => {
        dispatch({
          type: DELETE_USER,
          payload: {
            usersType: 'teamUsers',
            userId: userTeam[0] && userTeam[0].evaluatorId,
          }
        })
      })
      .catch(error => {
        console.log(error);
      });
  }
}

export function getUserTeamState({ userId, teamId }) {
  return fetch(`/evaluatorteam?evaluatorId=${userId}&teamId=${teamId}`, {
    headers: {
      'Authorization': getJwtToken(),
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })
    .then(response => {
      return response.json();
    })
    .catch();
}

function changeUserEvaluationState({ id, state }) {
  return fetch(`/evaluatorteam/${id}`, {
    body: JSON.stringify({
      state,
    }),
    headers: {
      'Authorization': getJwtToken(),
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
  })
    .catch();
}

// TODO - add backend validation, as well as UI
export function startUserEvaluation({ id }) {
  return changeUserEvaluationState({ id, state: evaluatorTeamState.evaluationStarted })
    .then(response => {
      return response.json();
    })
    .catch();
}

export function submitUserProblems({ id }) {
  return changeUserEvaluationState({ id, state: evaluatorTeamState.submittedProblems })
    .then(response => {
      return response.json();
    })
    .catch();
}

export function cancelUserProblems({ id }) {
  return changeUserEvaluationState({ id, state: evaluatorTeamState.evaluationStarted })
    .then(response => {
      return response.json();
    })
    .catch();
}

export function startRatingProblems({ id }) {
  return changeUserEvaluationState({ id, state: evaluatorTeamState.ratingProblems })
    .then(response => {
      return response.json();
    })
    .catch();
}

export function finishRatingProblems({ id }) {
  return changeUserEvaluationState({ id, state: evaluatorTeamState.evaluationFinished })
    .then(response => {
      return response.json();
    })
    .catch();
}
