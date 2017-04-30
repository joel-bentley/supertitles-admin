import React, { Component } from 'react';
import {
  ButtonToolbar,
  Button,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap';
import { db } from '../util/firebase';

class AdminPanel extends Component {
  state = {
    current: {},
    supertitles: [],
  };

  componentDidMount() {
    this.currentRef = db.ref('current');
    this.supertitlesRef = db.ref('supertitles');

    this.currentRef.once('value', snap => {
      this.setState({
        current: snap.val(),
      });
    });

    this.supertitlesRef.once('value', snap => {
      this.setState({ supertitles: snap.val() });
    });
  }

  componentWillUnmount() {
    this.currentRef.off();
    this.supertitlesRef.off();
  }

  changeIndex = step => {
    this.setState(
      prevState => {
        const arrayLength = prevState.supertitles.length;
        const prevIndex = prevState.current.index;

        let newIndex = prevIndex + step;

        if (newIndex < 0) {
          newIndex = arrayLength - 1;
        }

        if (newIndex > arrayLength - 1) {
          newIndex = 0;
        }

        return {
          current: {
            index: newIndex,
          },
        };
      },
      () => this.currentRef.set(this.state.current)
    );
  };

  // logout = () => {
  //   const { history } = this.props;
  //   auth
  //     .signOut()
  //     .then(console.log('Logged out'))
  //     .then(history.push('/login'))
  //     .catch(error => console.log(error.message));
  // };

  render() {
    const currentIndex = this.state.current.index;
    return (
      <div className="App container">
        <ButtonToolbar>
          <Button onClick={() => this.changeIndex(-1)}>Previous</Button>
          <Button onClick={() => this.changeIndex(1)}>Next</Button>
          {/*<Button style={{ float: 'right' }} onClick={this.logout}>
            Logout
          </Button>*/}
        </ButtonToolbar>
        <ListGroup style={{ marginTop: '10px' }}>
          {this.state.supertitles.map((supertitle, i) => (
            <ListGroupItem key={`supertitle-${i}`} active={i === currentIndex}>
              {supertitle.text}
            </ListGroupItem>
          ))}
        </ListGroup>
      </div>
    );
  }
}

export default AdminPanel;
