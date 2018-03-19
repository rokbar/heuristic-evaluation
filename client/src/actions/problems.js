import { SET_EVALUATOR_PROBLEMS } from './types';

import { getJwtToken} from 'utils/localStorage';

export function getEvaluatorProblems({ teamId }) {
  return (dispatch) => {
    return fetch(`/evaluatorproblems/${teamId}`, {
      headers: {
        'Authorization': getJwtToken(),
      },
      method: 'GET',
    })
      .then(response => {
        return response.json()
      })
      .then(problems => {
        dispatch({
          type: SET_EVALUATOR_PROBLEMS,
          payload: { problems },
        });
        console.log(problems);
      })
      .catch(error => {
        console.log(error);
      })
  }
}

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
