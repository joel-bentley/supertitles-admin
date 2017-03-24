import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';

import './App.css';

const App = () => (
  <Router>
    <div>
      <ProtectedRoute exact path="/" component={AdminPanel} />
      <Route path="/login" component={Login} />
    </div>
  </Router>
);

export default App;
