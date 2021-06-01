import React from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';

import './App.css';
import logo from './logo.svg';

import Dashboard from './components/Dashboard/Dashboard';
import Preferences from './components/Preferences/Preferences';
import Login from './components/Login/Login';
import useToken from './useToken';

function App() {
  const { token, setToken } = useToken();

  const removeToken = () => {
    localStorage.removeItem('token');
}

  if(!token) {
    return <Login setToken={setToken} />
  }

  return (
    <div className="App">
      <h1>MiniPokedex</h1>
      <img src={logo} alt="logo" />
      <br />
      <BrowserRouter>
        <Switch>
          <Route path='/dashboard'>
          <Link to='/login' onClick={removeToken()}>Logout</Link>
            <Dashboard />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;