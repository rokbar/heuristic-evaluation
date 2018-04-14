import {getJwtToken} from 'utils/localStorage';

export function createMergedProblems({
  problemsToCreate = [],
}) {
  return (dispatch) => {
    return fetch('/mergedproblems/create', {
      body: JSON.stringify({
        problemsToCreate
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
        return problem;
      })
      .catch(error => {
        console.log(error);
      });
  }
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