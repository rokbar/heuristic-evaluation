import { jwtAuth } from "actions/auth";
import { INIT } from "../actions/types";

export default function({ dispatch }) {
  return next => action => {
    const { type } = action;

    if (type === INIT) {
      const token = localStorage.getItem('feathers-jwt');

      if (token) {
        dispatch(jwtAuth({ token }));
      }
    }

    next(action);
  }
}