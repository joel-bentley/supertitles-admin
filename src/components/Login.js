import React from 'react';

import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Col from 'react-bootstrap/lib/Col';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';

const Login = ({ authorize, error }) => {
  let emailInput = null;
  let passwordInput = null;

  return (
    <div className="container">
      <h1>Sign in to access control panel</h1>
      <br />
      <Form horizontal>
        <FormGroup controlId="formHorizontalEmail">
          <Col componentClass={ControlLabel} sm={2}>
            Email
          </Col>
          <Col sm={10}>
            <FormControl
              type="email"
              placeholder="Email"
              inputRef={ref => (emailInput = ref)}
            />
            {error ? error : ''}
          </Col>
        </FormGroup>

        <FormGroup controlId="formHorizontalPassword">
          <Col componentClass={ControlLabel} sm={2}>
            Password
          </Col>
          <Col sm={10}>
            <FormControl
              type="password"
              placeholder="Password"
              inputRef={ref => (passwordInput = ref)}
            />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col smOffset={2} sm={10}>
            <Button
              onClick={() => authorize(emailInput.value, passwordInput.value)}
            >
              Sign in
            </Button>
          </Col>
        </FormGroup>
      </Form>
    </div>
  );
};

export default Login;
