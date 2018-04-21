import { filter } from 'lodash';
import {getJwtToken} from 'utils/localStorage';

import { SET_EVALUATOR_PROBLEMS_AS_REVISED, EDIT_FORM } from './types';

export function createMergedProblem({
  description,
  location,
  solution,
  photos,
  rules,
  evaluatorProblems,
  teamId,
  mergedProblemIds,
}) {
  return (dispatch) => {
    return fetch('/problems/merge', {
      body: JSON.stringify({
        description,
        location,
        solution,
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

// team leader can access all the time, evaluator - only when rating has started
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
  problemId,
  description = '',
  location,
  solution,
  photo = [],
  rules,
}) {
  return fetch(`/mergedproblems/edit/${problemId}`, {
    body: JSON.stringify({
      description,
      location,
      solution,
      photos: photo,
      rules: filter(rules, item => !!item),
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