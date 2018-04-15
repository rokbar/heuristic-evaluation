import { SET_HEURISTICS, SET_SHARED_HEURISTICS } from "./types";
import { getJwtToken} from "utils/localStorage";

export function getSharedHeuristics() {
  return (dispatch) => {
    return fetch(`/heuristics/all`, {
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
          type: SET_SHARED_HEURISTICS,
          payload: { heuristics },
        });
        console.log(heuristics);
      })
      .catch(error => {
        console.log(error);
      })
  }
}

export function getHeuristicsRules({ heuristicId }) {
  return (dispatch) => {
    return fetch(`/heuristics/${heuristicId}/rules`, {
      headers: {
        'Authorization': getJwtToken(),
      },
      method: 'GET',
    })
      .then(response => {
        return response.json()
      })
      .then(rules => {
        dispatch({
          type: SET_HEURISTICS,
          payload: { heuristics: [{ id: heuristicId, rules }] },
        });
        console.log(rules);
      })
      .catch(error => {
        console.log(error);
      })
  }
}