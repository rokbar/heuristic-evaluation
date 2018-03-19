import { SET_EVALUATOR_PROBLEMS } from './types';

export function createProblem({
  description = '',
  location,
  photo = null,
  ruleId,
  teamId,
}) {
  return (dispatch) => {
    return fetch('/problems/create', {
      body: JSON.stringify({
        description,
        location,
        photo,
        ruleId,
        teamId,
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
      .then(problems => {
        console.log(problems);
        return problems.length && dispatch({
          type: SET_EVALUATOR_PROBLEMS,
          payload: problems,
        })
      })
      .catch(error => {
        console.log(error);
      });
  }
}
