import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './authReducer';
import editFormReducer from './editFormReducer';
import usersReducer from './usersReducer';
import companiesReducer from './companiesReducer';
import teamsReducer from "./teamsReducer";
import teamStatesReducer from './teamStatesReducer';
import heuristicsReducer from './heuristicsReducer';
import evaluatorProblemsReducer from './evaluatorProblemsReducer';

const appReducer = combineReducers({
  router: routerReducer,
  form: formReducer,
  auth: authReducer,
  editForm: editFormReducer,
  users: usersReducer,
  companies: companiesReducer,
  teams: teamsReducer,
  teamStates: teamStatesReducer,
  heuristics: heuristicsReducer,
  evaluatorProblems: evaluatorProblemsReducer,
});

export default appReducer;