import React from 'react';
import { auth, isAuthenticated } from './util/firebase';

import AdminPanel from './components/AdminPanel';
import Login from './components/Login';

import './App.css';

class App extends React.Component {
  state = { authState: false, error: null };
  componentDidMount() {
    this.updateAuthState();
    if (!this.state.authState) {
      this.authorize('test@test.com', 'testing');
    }
  }
  updateAuthState = () => {
    this.setState({ authState: isAuthenticated() });
  };

  authorize = async (email, password) => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
      console.log('Logged in');
      this.updateAuthState();
      this.setState({ error: null });
    } catch (error) {
      console.log(error.message);
      this.setState({ error: error.message });
    }
  };

  // logout = async () => {
  //   try {
  //     await auth.signOut();
  //     console.log('Logged out');
  //     this.updateAuthState();
  //     this.setState({ error: null });
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  logout = () => {
    console.log("You can't Log out ;)");
  };

  render() {
    const { authState, error } = this.state;
    return authState ? (
      <AdminPanel logout={this.logout} />
    ) : (
      <div />
      // <Login authorize={this.authorize} error={error} />
    );
  }
}

export default App;
