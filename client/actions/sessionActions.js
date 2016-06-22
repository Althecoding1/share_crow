import fetch from 'isomorphic-fetch';

/*
--------------------------------------
  ACTION TYPES
--------------------------------------
*/

export const SESSION_GET_REQUEST = 'SESSION_GET_REQUEST';
export const SESSION_GET_RESPONSE = 'SESSION_GET_RESPONSE';

/*
---------------------------------------
  ACTION CREATORS
---------------------------------------
*/

// -------------GET--------------------

export function sessionGetRequest() {
  return {
    type: SESSION_GET_REQUEST,
  };
}
export function sessionGetResponse(data) {
  return {
    type: SESSION_GET_RESPONSE,
    data,
  };
}
export function getSession(query) {
  return dispatch => {
    dispatch(sessionGetRequest());
    return fetch(`/main/login?${query}`, { credentials: 'same-origin' })
      .then(response => response.json())
      .then(json => {
        console.log(json);
        dispatch(sessionGetResponse(json));
      });
  };
}
