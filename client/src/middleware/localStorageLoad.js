import { jwtAuth } from "actions/auth";
import { INIT } from "../actions/types";

export default store => next => action => {
  const { type } = action;

  if (type === INIT) {
    const token = localStorage.getItem('feathers-jwt');

    if (token) {
      store.dispatch(jwtAuth({ token }));
    }
  }

  next(action);
}