import { getJwtToken} from "utils/localStorage";

export function getUserRatingsByTeam({ teamId }) {
  return fetch(`/evaluatorratings/${teamId}`, {
    headers: {
      'Authorization': getJwtToken(),
    },
    method: 'GET',
  })
    .then(response => {
      return response.json()
    })
    .then(ratings => {
      console.log(ratings);
      return ratings;
    })
    .catch(error => {
      console.log(error);
    })
}

// TODO - check if ratings array is not empty
export function createOrUpdateRatings({ ratings }) {
  return fetch(`/ratings/createOrUpdateBatch`, {
    body: JSON.stringify({
      ratings
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
    .then(ratings => {
      return ratings;
    })
    .catch(error => {
      console.log(error);
    });
}
