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
      })
      .catch(error => {
        console.log(error);
      });
  }
}

export function removeUserFromTeam({ userId, teamId }) {
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
      method: 'DELETE',
    })
      .then(response => {
        return response.json();
      })
      .then(userTeam => {
        console.log(userTeam);
      })
      .catch(error => {
        console.log(error);
      });
  }
}
