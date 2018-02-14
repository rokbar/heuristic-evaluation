import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './authReducer';

const appReducer = combineReducers({
  router: routerReducer,
  form: formReducer,
  auth: authReducer,
});

export default appReducer;