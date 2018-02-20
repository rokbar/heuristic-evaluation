import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './authReducer';
import usersReducer from './usersReducer';

const appReducer = combineReducers({
  router: routerReducer,
  form: formReducer,
  auth: authReducer,
  users: usersReducer,
});

export default appReducer;