import { filter } from 'lodash';
import {
  SET_EVALUATOR_PROBLEMS,
  ADD_EVALUATOR_PROBLEM,
  DELETE_EVALUATOR_PROBLEM,
} from '../actions/types';

export default (state = [], action) => {
  switch(action.type) {
    case SET_EVALUATOR_PROBLEMS: {
      const { problems } = action.payload;
      return [ ...problems ];
    }
    case ADD_EVALUATOR_PROBLEM: {
      const { problem } = action.payload;
      return [ ...state, problem ];
    }
    case DELETE_EVALUATOR_PROBLEM: {
      const { problemId } = action.payload;
      const filteredProblems = filter(state, (item) => item.id !== problemId);
      return [ ...state, ...filteredProblems ];
    }
  }

  return state;
}
