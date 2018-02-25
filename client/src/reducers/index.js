import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './authReducer';
import editFormReducer from './editFormReducer';
import usersReducer from './usersReducer';
import companiesReducer from './companiesReducer';

const appReducer = combineReducers({
  router: routerReducer,
  form: formReducer,
  auth: authReducer,
  editForm: editFormReducer,
  users: usersReducer,
  companies: companiesReducer,
});

export default appReducer;