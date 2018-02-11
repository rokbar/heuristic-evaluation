import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';

const appReducer = combineReducers({
  router: routerReducer,
  form: formReducer,
});

export default appReducer;