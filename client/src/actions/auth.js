import feathers from '@feathersjs/client';
import {push} from 'react-router-redux'
import {SubmissionError} from 'redux-form'
import {includes} from 'lodash';

import {
  AUTH_USER,
  UNAUTH_USER,
} from './types';

const rest = feathers.rest;
const auth = feathers.authentication;

const feathersClient = feathers();
feathersClient.configure(rest().fetch(fetch)).configure(auth({storage: localStorage}));

export function localAuth({username, password}) {
  return (dispatch) => {
    return feathersClient.authenticate({
      strategy: 'local',
      email: username,
      password: password,
    })
      .then(response => {
        return feathersClient.passport.verifyJWT(response.accessToken);
      })
      .then(payload => {
        const {name, role, userId, companyId} = payload;
        dispatch({
          type: AUTH_USER,
          payload: {
            userId,
            name,
            role,
            companyId,
            authenticated: true,
          }
        });
        return feathersClient.service('users').get(payload.userId);
      })
      .then(user => {
        feathersClient.set('user', user);
        dispatch(push(`${user.role}`));
      })
      .catch(function (error) {
        console.error('Error authenticating!', error);
        dispatch(push('/'));
        return authError(error);
      });
  }
}

function authError(error = {message: ''}) {
  const {message} = error;
  const submissionMessage = includes(['Missing credentials', 'Invalid login'], message)
    ? 'Neteisingi prisijungimo duomenys'
    : 'Įvyko klaida';

  throw new SubmissionError({_error: submissionMessage})
}

export function jwtAuth({token}) {
  return (dispatch) => {
    feathersClient.authenticate({
      strategy: 'jwt',
      accessToken: token,
    })
      .then(response => {
        return feathersClient.passport.verifyJWT(response.accessToken);
      })
      .then(payload => {
        const {name, role, userId, companyId} = payload;
        dispatch({
          type: AUTH_USER,
          payload: {
            userId,
            name,
            role,
            companyId,
            authenticated: true,
          }
        });
        return feathersClient.service('users').get(payload.userId);
      })
      .then(user => {
        feathersClient.set('user', user);
        dispatch(push(`${user.role}`));
      })
      .catch(function (error) {
        console.error('Error authenticating!', error);
        dispatch(push('/'));
      });
  }
}

export function logout() {
  return (dispatch) => {
    feathersClient.logout()
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });

    dispatch({type: UNAUTH_USER});
    dispatch(push('/'));
  }
}
