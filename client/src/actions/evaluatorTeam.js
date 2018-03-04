import {ADD_USER, DELETE_USER} from './types';
import { getJwtToken } from 'utils/localStorage';

export function addUserToTeam({ evaluator_id: userId, team_id: teamId }) {
  return (dispatch) => {
    return fetch('/evaluatorteam', {
      body: JSON.stringify({
        evaluator_id: userId,
        team_id: teamId,
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
    return fetch(`/evaluatorteam?evaluator_id=${userId}&team_id=${teamId}`, {
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
            userId: userTeam[0] && userTeam[0].evaluator_id,
          }
        })
      })
      .catch(error => {
        console.log(error);
      });
  }
}
