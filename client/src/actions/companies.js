import { SET_COMPANIES } from './types';
import { getJwtToken} from "utils/localStorage";

export function getCompanies() {
  return (dispatch) => {
    return fetch('/companies', {
      headers: {
        'Authorization': getJwtToken(),
      },
      method: 'GET',
    })
      .then(response => {
        return response.json()
      })
      .then(companies => {
        dispatch({
          type: SET_COMPANIES,
          payload: { companies },
        });
      })
      .catch(error => {
        console.log(error);
      })
  }
}

export function addCompany({ name, country, url, address }) {
  return (dispatch, getState) => {
    const { userId } = getState().auth;
    return fetch('/companies', {
      body: JSON.stringify({
        name,
        country,
        url,
        address,
        systemAdminId: userId,
      }),
      headers: {
        'Authorization': getJwtToken(),
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
      .then(response => {
        return response.json();
      })
      .then(companies => {
        console.log(companies);
      })
      .catch(error => {
        console.log(error);
      });
  }
}