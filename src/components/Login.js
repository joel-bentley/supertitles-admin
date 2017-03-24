import React from 'react';
import { Button } from 'react-bootstrap';
import { auth } from '../util/firebase';

const Login = ({ history }) => (
  <div className="container">
    <h1>Login</h1>
    <Button onClick={() => authorize(history)}>Press me to login</Button>
  </div>
);

function authorize(history) {
  auth
    .signInWithEmailAndPassword('jbben24@yahoo.com', 'testtesttest')
    .then(console.log('Logged in'))
    .then(() => history.push('/'))
    .catch(error => console.log(error.message));
}

export default Login;
