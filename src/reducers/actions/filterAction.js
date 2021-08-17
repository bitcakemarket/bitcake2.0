export const SET_FILTER = 'SET_FILTER';

export function updateFilter(payload) {
  return {
    type: SET_FILTER,
    payload: payload,
  };
}