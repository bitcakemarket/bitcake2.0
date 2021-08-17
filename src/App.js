import React, { useEffect, useState } from "react";
import "./App.css";
import Routes from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "firebase.js";
import {FilterContext} from "./FilterContext"

const App = () => {
  const [authenticated, setAuthenticated] = useState(null);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user ? setAuthenticated(true) : setAuthenticated(false);
    });
  });
  const [filter, setFilter] = useState("");
  const value = { filter, setFilter };

  return (
    <FilterContext.Provider value={value}>
      <div className="App">
        <Routes authenticated={authenticated} />
        <ToastContainer autoClose={5000} hideProgressBar />
      </div>
    </FilterContext.Provider>
  );
};

export default App;
