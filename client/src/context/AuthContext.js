import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';

const AuthContext = createContext();

const AuthContextProvider = (props) => {
  const [loggedIn, setLoggedIn] = useState(undefined);
  const [username, setUsername] = useState(undefined);

  const getLoggedIn = async () => {
    const loggedInRes = await axios.get('https://treeoflinks.herokuapp.com//auth/loggedIn');

    setLoggedIn(loggedInRes.data.loggedIn);
    setUsername(loggedInRes.data.username);
  };

  useEffect(() => {
    getLoggedIn();
  });

  return <AuthContext.Provider value={{loggedIn, getLoggedIn, username}}>
    {props.children}
  </AuthContext.Provider>
};

export default AuthContext;
export {AuthContextProvider};