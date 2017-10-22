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

  handleLogout = async () => {
    if (this.state.currentIndex !== null) {
      await this.currentIndexRef.set(null);
    }
    this.props.logout();
  };

  handleStartStop = () => {
    this.setState(prevState => {
      const newIsStarted = !prevState.isStarted;
      const newIndex = newIsStarted ? prevState.lastIndex : null;

      this.currentIndexRef.set(newIndex);

      return { isStarted: newIsStarted, currentIndex: newIndex };
    });
  };

  render() {
    const { name, currentIndex, lastIndex, isStarted, slides } = this.state;

    // const slidesSlice = isStarted ? sliceAround(slides, currentIndex) : slides;
    const slidesSlice = sliceAround(slides, lastIndex);

    return (
      <div className="App container">
        <div className="text-center">Slides for:  <b>{name}</b></div>
        <ButtonToolbar>
          <Button
            style={{ marginRight: 5 }}
            bsStyle={isStarted ? 'danger' : 'success'}
            onClick={this.handleStartStop}
          >
            {isStarted ? (
              <div>Stop Sending</div>
            ) : (
              <div>Start Sending Slide {lastIndex + 1}</div>
            )}
          </Button>

          {!isStarted &&
            lastIndex !== 0 && (
              <Button
                bsStyle="warning"
                onClick={() => this.setState({ lastIndex: 0 })}
              >
                Reset to Slide 1
              </Button>
            )}

          {isStarted && (
            <Button
              bsStyle="info"
              style={{ marginLeft: 50 }}
              onClick={() => this.changeIndex(-1)}
            >
              <Glyphicon style={{ marginRight: 5 }} glyph="arrow-left" />
              Previous
            </Button>
          )}

          {isStarted && (
            <Button bsStyle="info" onClick={() => this.changeIndex(1)}>
              Next <Glyphicon style={{ marginLeft: 5 }} glyph="arrow-right" />
            </Button>
          )}

          <Button style={{ float: 'right' }} onClick={this.handleLogout}>
            Logout
          </Button>
        </ButtonToolbar>
        <ListGroup style={{ marginTop: '25px' }}>
          <FlipMove duration={750} easing="ease-out">
            {slidesSlice.map(slide => (
              <ListGroupItem
                key={`slide-${slide.index}`}
                style={{
                  backgroundColor:
                    slide.index === currentIndex ? '#337ab7' : '#fff',
                  borderColor: '#171717',
                }}
                disabled={!isStarted}
              >
                <b>Slide {slide.index + 1}</b>
                <ListGroup style={{ marginTop: '5px' }}>
                  <ListGroupItem>
                    <b>Notes:</b> {slide.notes}
                  </ListGroupItem>
                  <ListGroupItem>
                    <b>Title:</b> {slide.title}
                  </ListGroupItem>
                  <ListGroupItem>
                    <b>Text:</b> {slide.text}
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
