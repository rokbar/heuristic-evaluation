import { SET_HEURISTICS } from "../actions/types";

export default (state = [], action) => {
  switch(action.type) {
    case SET_HEURISTICS: {
      const { heuristics } = action.payload;
      return [ ...heuristics ];
    }
  }

  return state;
}
