import React from 'react';

import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';

import { db } from '../util/firebase';

class AdminPanel extends React.Component {
  state = {
    currentIndex: 0,
    supertitles: [],
    isStarted: false,
  };

  componentDidMount() {
    this.currentIndexRef = db.ref('current/index');
    this.currentProgramRef = db.ref('current/program');

    this.currentIndexRef.once('value', indexSnapshot => {
      const currentIndex = indexSnapshot.val();
      this.setState({ currentIndex });
      if (currentIndex !== null && typeof currentIndex === 'number') {
        this.setState({ isStarted: true });
      }
    });

    this.currentProgramRef.once('value', programSnapshot => {
      const currentProgram = programSnapshot.val();

      db.ref(currentProgram).once('value', supertitlesSnaphot => {
        const supertitles = supertitlesSnaphot.val();
        this.setState({ supertitles });
        console.log({supertitles});
      });
    });
  }

  async componentWillUnmount() {
    await this.currentIndexRef.remove();
  }

  changeIndex = step => {
    this.setState(
      prevState => {
        const arrayLength = prevState.supertitles.length;
        const prevIndex = prevState.currentIndex;

        let newIndex = prevIndex + step;

        if (newIndex < 0) {
          newIndex = arrayLength - 1;
        }

        if (newIndex > arrayLength - 1) {
          newIndex = 0;
        }

        return { currentIndex: newIndex };
      },
      () => this.currentIndexRef.set(this.state.currentIndex)
    );
  };

  handleStartStop = () => {
    this.setState(prevState => {
      const newIsStarted = !prevState.isStarted;
      const newIndex = newIsStarted ? 0 : null;

      this.currentIndexRef.set(newIndex);

      return { isStarted: newIsStarted, currentIndex: newIndex };
    });
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
    const { currentIndex, isStarted } = this.state;
    return (
      <div className="App container">
        <ButtonToolbar>
          <Button
            style={{ marginRight: 50 }}
            bsStyle={isStarted ? 'danger' : 'success'}
            onClick={this.handleStartStop}
          >
            {isStarted ? <div>Stop Sending</div> : <div>Start Sending</div>}
          </Button>

          {isStarted &&
            <Button bsStyle="info" onClick={() => this.changeIndex(-1)}>
              <Glyphicon style={{ marginRight: 5 }} glyph="arrow-left" />
              Previous
            </Button>}

          {isStarted &&
            <Button bsStyle="info" onClick={() => this.changeIndex(1)}>
              Next <Glyphicon style={{ marginLeft: 5 }} glyph="arrow-right" />
            </Button>}

          {/*<Button style={{ float: 'right' }} onClick={this.logout}>
            Logout
          </Button>*/}
        </ButtonToolbar>
        <ListGroup style={{ marginTop: '25px' }}>
          {this.state.supertitles.map((supertitle, i) => (
            <ListGroupItem
              key={`supertitle-${i}`}
              active={i === currentIndex}
              disabled={!isStarted}
            >
              {supertitle.text}
            </ListGroupItem>
          ))}
        </ListGroup>
      </div>
    );
  }
}

export default AdminPanel;
