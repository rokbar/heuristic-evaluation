import { SET_HEURISTICS, SET_SHARED_HEURISTICS } from "../actions/types";

export default (state = { shared: [], team: [] }, action) => {
  switch(action.type) {
    case SET_HEURISTICS: {
      const { heuristics } = action.payload;
      return { ...state, team: [...heuristics] };
    }
    case SET_SHARED_HEURISTICS: {
      const { heuristics } = action.payload;
      return { ...state, shared: [...heuristics] }
    }
  }

  return state;
}
