import React from 'react';

import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';

import FlipMove from 'react-flip-move';

import { db } from '../util/firebase';

const NUM_ITEMS_TO_SHOW = 4;

function sliceAround(arr, index) {
  let begin = index - Math.floor(NUM_ITEMS_TO_SHOW / 2) + 1;
  if (begin < 0) {
    begin = 0;
  }
  let end = begin + NUM_ITEMS_TO_SHOW;
  if (end > arr.length) {
    end = arr.length;
  }
  return arr.slice(begin, end);
}

class AdminPanel extends React.Component {
  state = {
    currentIndex: 0,
    lastIndex: 0,
    slides: [],
    name: '',
    isStarted: false,
  };

  componentDidMount() {
    this.currentIndexRef = db.ref('current/index');
    this.currentProgramRef = db.ref('current/program');

    this.currentIndexRef.once('value', indexSnapshot => {
      const currentIndex = indexSnapshot.val();
      const lastIndex = currentIndex || 0;
      this.setState({ currentIndex, lastIndex });
      if (currentIndex !== null && typeof currentIndex === 'number') {
        this.setState({ isStarted: true });
      }
    });

    this.currentProgramRef.once('value', programSnapshot => {
      const currentProgram = programSnapshot.val();

      db.ref(currentProgram).once('value', supertitlesSnaphot => {
        const { slides, name } = supertitlesSnaphot.val();

        slides.forEach((slide, i) => {
          slide.index = i;
        });

        this.setState({ slides, name });
        // console.log({ slides });
      });
    });
  }

  async componentWillUnmount() {
    await this.currentIndexRef.remove();
  }

  changeIndex = step => {
    this.setState(
      prevState => {
        const arrayLength = prevState.slides.length;
        const prevIndex = prevState.currentIndex;

        let newIndex = prevIndex + step;

        if (newIndex < 0) {
          newIndex = arrayLength - 1;
        }

        if (newIndex > arrayLength - 1) {
          newIndex = 0;
        }

        return { currentIndex: newIndex, lastIndex: newIndex };
      },
      () => this.currentIndexRef.set(this.state.currentIndex)
    );
  };

  handleStartStop = () => {
    this.setState(prevState => {
      const newIsStarted = !prevState.isStarted;
      const newIndex = newIsStarted ? prevState.lastIndex : null;

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
    const { currentIndex, isStarted, slides } = this.state;

    const slidesSlice = sliceAround(slides, currentIndex);

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
          <FlipMove duration={750} easing="ease-out">
            {slidesSlice.map(slide => (
              <ListGroupItem
                key={`slide-${slide.index}`}
                style={{
                  backgroundColor: slide.index === currentIndex
                    ? '#337ab7'
                    : '#fff',
                }}
                disabled={!isStarted}
              >
                <ListGroup style={{ marginTop: '18px' }}>
                  <ListGroupItem>
                    {slide.notes}
                  </ListGroupItem>
                  <ListGroupItem>
                    {slide.text}
                  </ListGroupItem>
                </ListGroup>
              </ListGroupItem>
            ))}
          </FlipMove>
        </ListGroup>
      </div>
    );
  }
}

export default AdminPanel;
