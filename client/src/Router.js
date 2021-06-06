import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Header from './components/layout/Header';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import AuthContext from './context/AuthContext';
import Links from './components/admin/Links';
import LinksPage from './components/LinksPage';
import Appearance from './components/appearance/Appearance';

const Router = () => {
  const [status, setStatus] = useState('loading');
  const {loggedIn, getLoggedIn} = useContext(AuthContext);

  useEffect(() => {
    (async function() {
      try {
        await getLoggedIn();
        setStatus(loggedIn ? 'loggedIn' : 'loggedOut');
      } catch {
        setStatus('loggedOut');
      }
    })();
  });

  if (status === 'loading') {
    return (
      <div className="ui segment">
        <div className="ui active inverted dimmer">
          <div className="ui text loader"  style={{ marginTop: '80px' }}>Loading</div>
        </div>
      </div>
    )
  }

  return <BrowserRouter>
    <Switch>
      <Route 
        exact path='/'
        render={
          () => (loggedIn ? <Redirect to='/admin' /> : <Redirect to='/login' />
        )} 
      />
      <Route exact path='/register'>
        {loggedIn ? <Redirect to='/admin' /> : 
          <>
            <Header />
            <Register /> 
          </> 
        }
      </Route> 
      <Route exact path='/login'>
        {loggedIn ? <Redirect to='/admin' /> : 
          <>
            <Header />
            <Login /> 
          </> 
        }
      </Route> 
      <Route exact path='/admin'>
        {!loggedIn ? <Redirect to='/login' /> : 
          <>
            <Header />
            <Links /> 
          </> 
        }
      </Route> 
      <Route exact path='/appearance'>
        {!loggedIn ? <Redirect to='/login' /> : 
          <>
            <Header />
            <Appearance /> 
          </> 
        }
      </Route> 
      <Route path='/:username'>
        <LinksPage />
      </Route>
    </Switch>
  </BrowserRouter>; 
}

export default Router;