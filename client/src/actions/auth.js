import feathers from '@feathersjs/feathers';
import rest from '@feathersjs/rest-client';
import auth from '@feathersjs/authentication-client';
import { push } from 'react-router-redux'

import {
  AUTH_USER,
  UNAUTH_USER,
} from './types';

const feathersClient = feathers();
feathersClient.configure(rest().fetch(fetch)).configure(auth({ storage: localStorage }));

export function localAuth({ username, password }) {
  return (dispatch) => {
    feathersClient.authenticate({
      strategy: 'local',
      email: username,
      password: password,
    })
      .then(response => {
        console.log('Authenticated!', response);
        return feathersClient.passport.verifyJWT(response.accessToken);
      })
      .then(payload => {
        console.log('JWT Payload', payload);
        const { name, role, userId, companyId } = payload;
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
        console.log('User', feathersClient.get('user'));
        dispatch(push(`${user.role}`));
      })
      .catch(function (error) {
        console.error('Error authenticating!', error);
        dispatch(push('/'));
      });
  }
}

export function jwtAuth({ token }) {
  return (dispatch) => {
    feathersClient.authenticate({
      strategy: 'jwt',
      accessToken: token,
    })
      .then(response => {
        console.log('Authenticated!', response);
        return feathersClient.passport.verifyJWT(response.accessToken);
      })
      .then(payload => {
        console.log('JWT Payload', payload);
        const { name, role, userId, companyId } = payload;
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
        console.log('User', feathersClient.get('user'));
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

    dispatch({ type: UNAUTH_USER });
    dispatch(push('/'));
  }
}
