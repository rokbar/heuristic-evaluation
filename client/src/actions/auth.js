import feathers from '@feathersjs/feathers';
import rest from '@feathersjs/rest-client';
import auth from '@feathersjs/authentication-client';
import { push } from 'react-router-redux'

import {
  AUTH_USER,
} from './types';

const feathersClient = feathers();
feathersClient.configure(rest().fetch(fetch)).configure(auth({ storage: localStorage }));

export function localAuth({ username, password }) {
  return (dispatch) => {
    let role;
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
        role = payload.role;
        dispatch({
          type: AUTH_USER,
          payload: {
            role,
            authenticated: true,
          }
        });
        return feathersClient.service('users').get(payload.userId);
      })
      .then(user => {
        feathersClient.set('user', user);
        console.log('User', feathersClient.get('user'));
        dispatch(push(`${user.typeSelector}`));
      })
      .catch(function (error) {
        console.error('Error authenticating!', error);
        dispatch(push('/'));
      });
  }
}

export function jwtAuth({ token }) {
  return (dispatch) => {
    let role;
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
        role = payload.role;
        dispatch({
          type: AUTH_USER,
          payload: {
            role,
            authenticated: true,
          }
        });
        return feathersClient.service('users').get(payload.userId);
      })
      .then(user => {
        feathersClient.set('user', user);
        console.log('User', feathersClient.get('user'));
        dispatch(push(`${user.typeSelector}`));
      })
      .catch(function (error) {
        console.error('Error authenticating!', error);
        dispatch(push('/'));
      });
  }
}

export function signInUser({ username, password }) {
  return function (dispatch) {
    fetch('api/signin', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
      .then(response => {
        // If request is good...
        // - Update state to indicate user is authenticated
        dispatch({
          type: AUTH_USER
        });
        // - Save the JWT token and username
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', username);
        // - Redirect to the route '/'
        dispatch.push('/groups');
      })
      .catch(() => {
        // dispatch(authError('Bad Login Info'));
      });
  }
}

// export function signupUser({ username, password }) {
//   return function (dispatch) {
//     axios.post(`${ROOT_URL}/signup`, { username, password })
//       .then(response => {
//         dispatch({
//           type: AUTH_USER
//         });
//         localStorage.setItem('token', response.data.token);
//         localStorage.setItem('username', username);
//         browserHistory.push('/groups');
//       })
//       .catch(error => {
//         dispatch(authError(error.response.data.error));
//       });
//   }
// }