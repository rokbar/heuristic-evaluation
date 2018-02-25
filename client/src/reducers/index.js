import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './authReducer';
import editFormReducer from './editFormReducer';
import usersReducer from './usersReducer';
import companiesReducer from './companiesReducer';
import teamsReducer from "./teamsReducer";

const appReducer = combineReducers({
  router: routerReducer,
  form: formReducer,
  auth: authReducer,
  editForm: editFormReducer,
  users: usersReducer,
  companies: companiesReducer,
  teams: teamsReducer,
});

export default appReducer;