import React, { Component } from 'react';
// import './App.css';
import { Button, Container, Grid, Header, Menu, Segment, Table, Label, Form, Input, Popup, Icon, Modal} from 'semantic-ui-react';
import axios from 'axios';
// import random from Math;

function NavBar(props) {
  return (
    <Menu>
      <Menu.Item>Our Company</Menu.Item>
      <Menu.Item>Item 2</Menu.Item>
      <Menu.Item>About</Menu.Item>
    </Menu>
  )
}

class TaskInput extends Component {
  constructor(props){
    super(props);
    this.state = {
      task: "",
      time: ""
      };

      this.handleChange = this.handleChange.bind(this);
      this.submitTask = this.submitTask.bind(this);
    }

    handleChange(event) {
      let name = event.target.name;
      let value = event.target.value;
      if (name === 'time') {
        value = parseInt(value);
      }
      this.setState({
        [name]: value
      });
    }

    submitTask(event) {
      const newObj = Object.assign({},this.state);
      this.props.addTask(newObj);
      for (const item in this.state) {
        this.setState({
          [item] : ""
          });
      };
    }

    render() {
      return(
        <Form>
          <Form.Group inline>
            <Form.Field style={{ marginRight: '0', paddingRight: "0"}}>
              <Input
                placeholder="Add a new task"
                onChange={this.handleChange}
                name='task'
                value={this.state.task}/>
            </Form.Field>
            <Form.Field style={{ paddingLeft: "0"}}>
              <Input
                label={{basic:true, content: 'min'}}
                labelPosition='right'
                placeholder="Time"
                name='time'
                value = {this.state.time}
                onChange={this.handleChange}/>
            </Form.Field>
            <Form.Field>
              <Button onClick={this.submitTask}>+</Button>
            </Form.Field>
          </Form.Group>
        </Form>
      )
    }
}

class TaskList extends Component {
  // The state for the list is the JSON {taskID, taskContent, taskTime} list
  constructor(props){
    super(props);
    this.addTask = this.addTask.bind(this);
    }

    addTask(newObject) {
      this.props.onListChange(newObject);
    }


  render() {

    const listItems = this.props.tasks.map((task)=>
      <Table.Row key={task.id}><Table.Cell><Label>{task.task}</Label><Label>{task.time}</Label></Table.Cell></Table.Row>);

    return(
    <Table basic={true} celled collapsing>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>{this.props.name}</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        <Table.Row>
          <Table.Cell>
            <TaskInput addTask={this.addTask}></TaskInput>
          </Table.Cell>
        </Table.Row>
        {listItems}
      </Table.Body>
    </Table>
    )
  }
}

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
    this.renderSquares = this.renderSquares.bind(this);
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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks : [],
      habits : [],
      supers : [],
      currentTask: null,
      previousTasks: [],
      completedTasks: [],
      gold: 0
    };

    this.handleListChange = this.handleListChange.bind(this);
    this.getNewTask = this.getNewTask.bind(this);
    this.completedTask = this.completedTask.bind(this);
  }

  componentDidMount() {
    axios.get('/taskList/')
    .then((res) => {
      console.log("Obtained data from server",res.data);
      this.setState({tasks : res.data});
    })
    .catch((err) => console.log(err));
  }

  // TODO: Post new info to DB, check if task is duplicate
  handleListChange(newTask) {
    console.log("New task added", newTask);
    axios.post('/taskList', {
      task: newTask.task,
      time: newTask.time
    })
    .then((resp) => console.log("Successfully added ", newTask))
    .catch((err) => console.log(err));

    const newList = this.state.tasks.slice();
    newList.push(newTask);
    this.setState({tasks: newList});
  }

  completedTask(task, elapsed) {
    console.log("Worked on task", task, "for ", elapsed, "seconds");
    let newList = this.state.completedTasks.slice();
    newList.push({task, elapsed: task.time - elapsed});
    this.setState({completedTasks : newList});
    console.log("List looks like: ", this.state.completedTasks);
  }

  getNewTask() {
    if (this.state.tasks.length > 0){
      // We want to return a random task, but not the same few tasks in a row
      var cutArray = this.state.tasks.slice();
      this.state.previousTasks.forEach((item, index) => {
        var cutIndex = cutArray.indexOf(item);
        if (cutIndex !== -1){
          cutArray.splice(cutIndex, 1);
        }
      });
      var retTask = null;      
      if (cutArray.length > 0) {
        retTask = cutArray[Math.floor(Math.random() * cutArray.length)];
      } else {
        retTask = this.state.tasks[Math.floor(Math.random() * this.state.tasks.length)];
      }
      // We want to update previousTasks to keep track of only the last two tasks done
      var newPrevious = this.state.previousTasks.slice();
      newPrevious.shift();
      newPrevious.push(retTask);
      this.setState({previousTasks: newPrevious, currentTask: retTask});
    }
    else {
      this.setState({currentTask: null});
    }
  }

  render() {
    return (
      <div>
        <NavBar></NavBar>
        <GameBoard tasks={this.state.tasks} getTask={this.getNewTask} currentTask={this.state.currentTask} completedTask={this.completedTask}></GameBoard>
        <Grid columns={3}>
          <Grid.Row>
            <Grid.Column>
              <TaskList name="Tasks" tasks={this.state.tasks}  onListChange={this.handleListChange}></TaskList>
            </Grid.Column>
            <Grid.Column>
              <TaskList name="Habits" tasks={this.state.habits} onListChange={this.handleListChange}></TaskList>
            </Grid.Column>
            <Grid.Column>
              <TaskList name="Supers" tasks={this.state.supers} onListChange={this.handleListChange}></TaskList>
            </Grid.Column>
          </Grid.Row>
      </Grid>
      </div>
    );
  }
}

export default App;
