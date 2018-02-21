import React, { Component } from 'react';
import { Button, Container, Grid, Header, Segment, Label, Popup, Icon, Modal} from 'semantic-ui-react';



class GameSquare extends Component {
    render() {
      const squareDisplay = (
        <Grid.Column
        color={this.props.type === 'task' ? "blue" : "orange"}
        style={{ margin: '0.5em', height: 20, width: 40 }}
        >
        {(this.props.cursor) && <Label attached="bottom"><Icon name="hand pointer"/></Label>}
        </Grid.Column>
      )
      return (
        <Popup trigger={squareDisplay}>
        <Popup.Header>{this.props.type}</Popup.Header>
          <Popup.Content>
            <Header><br/>Time</Header>
          </Popup.Content>
       </Popup>
      )
    }
  }
  
  class TaskModal extends Component {
    constructor(props) {
      super(props);
      this.state = {
        showAlert : false,
        open: false
      };
  
      this.validateTaskCompletion = this.validateTaskCompletion.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.handleOpen = this.handleOpen.bind(this);
      this.continueWorking = this.continueWorking.bind(this);
    }
  
    validateTaskCompletion() {
      if (this.props.elapsed < this.props.currentTask.time) {
        this.setState({showAlert: true});
      } else {
        this.props.completedTask(this.props.currentTask, this.props.elapsed);
        this.handleClose();
      }
    }
  
    continueWorking () {
      this.setState({
        showAlert:false
      })
    }
  
    handleClose () {
      this.props.stopTimer();    
      this.setState({
        showAlert: false,
        open: false
      });
    }
  
    handleOpen() {
      this.setState({
        open: true
      });
    }
    render () {
      
      // TODO: Fix timer.elapsed comparison issues because timer.elapsed is now in milliseconds
      return (
      <Modal
        trigger={<Button onClick={() => {this.props.startTimer(); this.handleOpen();}}>Start Timer</Button>}
        open={this.state.open}
        onClose={this.validateTaskCompletion}
      >
        <Modal.Header>Get Started!</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Header>{this.props.currentTask.task}</Header>
            <p>
              <span
                style={
                  this.props.timer !== 0 && (this.props.elapsed > this.props.currentTask.time)
                    ? { backgroundColor: "#80ced6" }
                    : {}
                }>
                {this.props.timer !== 0
                  ? (this.props.currentTask.time - this.props.elapsed)
                  : null
                  }
              </span>
            </p>
            <Modal open={this.state.showAlert}>
              <Modal.Header>Are you sure you want to quit this task? Or use a skip token?</Modal.Header>
              <Modal.Content>
                <Modal.Description>
                  <Button onClick={this.handleClose}>Quit</Button>
                  <Button onClick={this.continueWorking}>Continue working</Button>
                </Modal.Description>
              </Modal.Content>
            </Modal>
            <Button onClick={this.validateTaskCompletion}>Finished</Button>
          </Modal.Description>
        </Modal.Content>
      </Modal>
      );
    }
  }
  
  class GameBoard extends Component {
    constructor(props) {
      super(props);
      // Need some placeholder data for our gameboard.
      // Later, we'll call the REST API for this data
      var board = [];
      for (var i = 0; i < 22; i++) {
        var squareType = "";
        if (i % 3 === 0 || i % 3 === 1) {
          squareType = "task";
        } else {
          squareType = "chest";
        }
        var squareData = {
          type: squareType
        };
        board.push(squareData);
      }
      this.state = {
        position: 0,
        timer: {
          elapsed: 0,
          start: 0,
          timer: 0
        },
        gameArray: board
      };
      this.rollDice = this.rollDice.bind(this);
      this.startTimer = this.startTimer.bind(this);
      this.countDown = this.countDown.bind(this);
      this.stopTimer = this.stopTimer.bind(this);
    }
  
    rollDice() {
      this.setState(prevState => ({ position: prevState.position + 1 }));
      this.getNewTask();
    }
  
    countDown() {
      this.setState(prevState => ({
        timer: {
          ...prevState.timer,
          elapsed: Math.round((new Date() - prevState.timer.start)/1000).toFixed(2)
        }
      }));
    }
  
    stopTimer() {
      clearInterval(this.state.timer.timer);
      this.setState({
        timer: {
          ...this.state.timer,
          start: 0,
          timer: 0
        }
      });
    }
  
    startTimer() {
      if (this.props.currentTask === null) {
        console.log("No task Selected");
        return;
      }
      var myTimer = setInterval(this.countDown, 1000);
      this.setState({
        timer: {
          elapsed: 0,
          start: new Date(),
          timer: myTimer
        }
      });
    }
  
    renderSquares() {
      var retList = this.state.gameArray.map((square, index) => (
        <GameSquare
          key={index}
          cursor={this.state.position === index ? true : false}
          type={square["type"]}
          task={this.props.tasks.length > 0 ? this.props.tasks[0] : []}
        />
      ));
      return retList;
    }
  
    getNewTask() {
      this.props.getTask();
    }
  
    render() {
  
      return (
        <Segment>
          <Segment inverted style={{ minHeight: 150, padding: "1em 0em" }}>
            <Grid columns={16} padded="horizontally">
              {this.renderSquares()}
              <Container>
                {(() => {
                  if (this.state.gameArray[this.state.position].type === "task") {
                    if (this.props.currentTask !== null) {
                      return (
                        <Segment>
                          <Header>Get Started!</Header>
                          {this.props.currentTask.task}
                          <br />
                          {this.props.currentTask.time} minutes
                          <br />
                          <TaskModal
                          stopTimer={this.stopTimer}
                          startTimer={this.startTimer}
                          timer={this.state.timer.timer}
                          elapsed={this.state.timer.elapsed}
                          currentTask={this.props.currentTask}
                          completedTask={this.props.completedTask}
                          // startButton={}
                          />
                        </Segment>
                      );
                    } else {
                      return (
                        <Segment>
                          <Header>Get Started!</Header>
                          Add some tasks to get started!
                        </Segment>
                      );
                    }
                  }
                })()}
              </Container>
            </Grid>
          </Segment>
          <Container>
            <Segment>
              <Button
                onClick={this.rollDice}
                disabled={this.state.timer.timer !== 0}
              >
                Roll
              </Button>
            </Segment>
          </Container>
        </Segment>
      );
    }
  }

  export default GameBoard;