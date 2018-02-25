import {
  SET_TEAM_STATES,
} from './types';
import { getJwtToken} from "utils/localStorage";

export function getTeamStates() {
  return (dispatch) => {
    return fetch('/teamstates', {
      headers: {
        'Authorization': getJwtToken(),
      },
      method: 'GET',
    })
      .then(response => {
        return response.json()
      })
      .then(teamStates => {
        dispatch({
          type: SET_TEAM_STATES,
          payload: { teamStates },
        });
        console.log(teamStates);
      })
      .catch(error => {
        console.log(error);
      })
  }
}
