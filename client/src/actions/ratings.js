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
