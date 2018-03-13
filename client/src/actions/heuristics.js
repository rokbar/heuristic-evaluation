import { SET_HEURISTICS } from "./types";
import { getJwtToken} from "utils/localStorage";

export function getSharedHeuristics() {
  return (dispatch) => {
    return fetch(`/sharedheuristics`, {
      headers: {
        'Authorization': getJwtToken(),
      },
      method: 'GET',
    })
      .then(response => {
        return response.json()
      })
      .then(heuristics => {
        dispatch({
          type: SET_HEURISTICS,
          payload: { heuristics },
        });
        console.log(heuristics);
      })
      .catch(error => {
        console.log(error);
      })
  }
}