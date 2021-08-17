import {SET_FILTER} from "./actions/filterAction"

const initialFilterData = {
  filter: ""
};

function filter(state = initialFilterData, action) {
  switch (action.type) {
    case SET_FILTER:
      return {
        ...action.payload,
      };
    default:
      return state;
  }
}

export default filter