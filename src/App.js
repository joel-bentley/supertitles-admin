import React from 'react';
// import { HashRouter as Router, Route } from 'react-router-dom';

// import ProtectedRoute from './components/ProtectedRoute';
import AdminPanel from './components/AdminPanel';
// import Login from './components/Login';

import './App.css';

const App = () => (
  <AdminPanel />
  /*<Router>
    <div>
      <ProtectedRoute exact path="/" component={AdminPanel} />
      <Route path="/login" component={Login} />
    </div>
  </Router>*/
);

export default App;
