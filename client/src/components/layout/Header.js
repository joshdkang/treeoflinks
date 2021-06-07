import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import LogOutBtn from '../auth/LogOutBtn';

const Header = () => {
  const {loggedIn, username} = useContext(AuthContext);
  const home = loggedIn === false ? '/login' : '/admin';
  
  return (
    <div className="ui secondary pointing menu" style={{ backgroundColor: '#FFFFFF'}}>
      <Link to={home} className="item">TreeOfLinks</Link>
      {
        loggedIn === false && (
        <div className="right menu">
          <Link to="/login" className="item">Log In</Link>
          <Link to="/register" className="item">Register</Link>
        </div>
      )}
      {
        loggedIn === true && (
        <>
          <Link to="/admin" className="item">Links</Link>
          <Link to='/appearance' className="item">Appearance</Link>
          <Link to={`/${username}`} className="item">My TreeofLinks: {`${window.location.origin.toString()}/${username}`}</Link>
          <LogOutBtn />
        </>
      )}
    </div>
  );
}

export default Header;