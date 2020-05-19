import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Join from './components/Join'
import Game from './components/Game'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import './css/App.css';
import './css/Button.css';

const App = () => {

  return (
    <Router basename={'/secret-words/'}>
      <Route path='/' exact component={Join} />
      <Route path='/play/:room' component={Game} />
      <Route path='/login' component={Login} />
      <Route path='/dashboard' component={Dashboard} />
    </Router>
  );

}

export default App;
