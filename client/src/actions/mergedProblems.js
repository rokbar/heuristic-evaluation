import {getJwtToken} from 'utils/localStorage';

import { SET_EVALUATOR_PROBLEMS_AS_REVISED } from './types';

export function createMergedProblem({
  description,
  location,
  photos,
  rules,
  evaluatorProblems,
  teamId,
  mergedProblemIds,
}) {
  return (dispatch) => {
    return fetch('/mergedproblems/create', {
      body: JSON.stringify({
        description,
        location,
        photos,
        rules,
        evaluatorProblems,
        teamId,
        mergedProblemIds,
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
      .then(problem => {
        console.log(problem);
        dispatch({
          type: SET_EVALUATOR_PROBLEMS_AS_REVISED,
          payload: { mergedProblemIds },
        });
        return problem;
      })
      .catch(error => {
        console.log(error);
      });
  }
}

// only available for team leader
export function getGeneralizedProblems({ teamId }) {
  return fetch(`/teammergedproblems/${teamId}`, {
    headers: {
      'Authorization': getJwtToken(),
    },
    method: 'GET',
  })
    .then(response => {
      return response.json()
    })
    .then(problems => {
      console.log(problems);
      return problems;
    })
    .catch(error => {
      console.log(error);
    })
}

export function editMergedProblem({
  mergedProblemId,
  description = null,
  location = null,
}) {
  return (dispatch) => {
    return fetch(`/mergedproblems/edit/${mergedProblemId}`, {
      body: JSON.stringify({
        description,
        location,
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
      .then(problem => {
        return problem;
      })
      .catch(error => {
        console.log(error);
      });
  }
}

export function removeMergedProblem(mergedProblemId) {
  return (dispatch) => {
    return fetch(`/mergedproblems/remove/${mergedProblemId}`, {
      headers: {
        'Authorization': getJwtToken(),
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    })
      .then(response => {
        return response.json();
      })
      .then(problem => {
        return problem;
      })
      .catch(error => {
        console.log(error);
      });
  }
}