import { filter } from 'lodash';

import {
  ADD_EVALUATOR_PROBLEM,
  SET_EVALUATOR_PROBLEMS,
  DELETE_EVALUATOR_PROBLEM,
  EDIT_EVALUATOR_PROBLEM,
  EDIT_FORM,
} from './types';

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

// only available for team leader
// TODO - rethink method name
export function getSelectedEvaluatorProblems({ teamId }) {
  return (dispatch) => {
    return fetch(`/teamproblems/${teamId}`, {
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
  solution,
  photo = [],
  rules,
  teamId,
}) {
  return (dispatch) => {
    return fetch('/problems/create', {
      body: JSON.stringify({
        description,
        location,
        solution,
        photos: photo,
        rules: filter(rules, item => !!item),
        teamId,
      }),
      headers: {
        'Authorization': getJwtToken(),
        'Content-Type': 'application/json', // TODO-use multipart/form-data?
      },
      method: 'POST',
    })
      .then(response => {
        return response.json();
      })
      .then(problem => {
        console.log(problem);
        return problem && dispatch({
          type: ADD_EVALUATOR_PROBLEM,
          payload: {
            problem: {
              ...problem,
              photo: photo.uri,
            }
          },
        })
      })
      .catch(error => {
        console.log(error);
      });
  }
}

export function getProblemById({ problemId, formName = '' }) {
  return (dispatch) => {
    return fetch(`/problems/get/${problemId}`, {
      headers: {
        'Authorization': getJwtToken(),
      },
      method: 'GET',
    })
      .then(response => {
        return response.json()
      })
      .then(problem => {
        problem && dispatch({
          type: EDIT_FORM,
          formName,
          payload: { ...problem }
        });
        return problem;
      })
      .catch(error => {
        console.log(error);
      })
  }
}

export function editProblem({
  problemId,
  description = '',
  location,
  solution,
  photo = [],
  rules,
}) {
  return (dispatch) => {
    return fetch(`/problems/edit/${problemId}`, {
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
        return problem && dispatch({
          type: EDIT_EVALUATOR_PROBLEM,
          payload: { problem },
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
}

export function removeProblem(problemId) {
  return (dispatch) => {
    return fetch(`/problems/remove/${problemId}`, {
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
        return problem && dispatch({
          type: DELETE_EVALUATOR_PROBLEM,
          payload: { problemId: problem.id },
        })
      })
      .catch(error => {
        console.log(error);
      });
  }
}

export function submitEvaluatorProblems() {
  return (dispatch) => {
    return fetch(`/`, {

    })
      .then(response => {
        return response.json();
    })
  }
}
