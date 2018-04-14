import { filter, map, includes } from 'lodash';
import {
  SET_EVALUATOR_PROBLEMS,
  ADD_EVALUATOR_PROBLEM,
  EDIT_EVALUATOR_PROBLEM,
  DELETE_EVALUATOR_PROBLEM,
  SET_EVALUATOR_PROBLEMS_AS_REVISED,
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
    case EDIT_EVALUATOR_PROBLEM: {
      const { problem } = action.payload;
      const newState = map(state, (item) => (item.id === problem.id ? { ...problem } : { ...item }));
      return [ ...newState ];
    }
    case DELETE_EVALUATOR_PROBLEM: {
      const { problemId } = action.payload;
      const filteredProblems = filter(state, (item) => item.id !== problemId);
      return [ ...filteredProblems ];
    }
    case SET_EVALUATOR_PROBLEMS_AS_REVISED: {
      const { mergedProblemIds } = action.payload;
      const mappedProblems = map(state, (item) => includes(mergedProblemIds, item.id)
        ? { ...item, isRevised: true }
        : { ...item}
      );
      return [ ...mappedProblems ];
    }
  }

  return state;
}
