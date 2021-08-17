import { combineReducers } from "redux";
import authReducer from "./authReducer";
import userReducer from "./userReducer";
import filterReducer from "./filterReducer";

export default combineReducers({
  auth: authReducer,
  user: userReducer,
  filter: filterReducer
});
