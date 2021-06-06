import React, { useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { useHistory } from 'react-router';

function LogOutBtn() {

  const {getLoggedIn} = useContext(AuthContext);
  const history = useHistory();

  async function logOut() {
    await axios.post('https://treeoflinks.herokuapp.com/logout');
    await getLoggedIn();
    history.push('/login');
  }

  return (
    <div className="right menu">
      <button onClick={logOut} className="ui red button">
        Log out
      </button>
    </div>
  )
};

export default LogOutBtn;


