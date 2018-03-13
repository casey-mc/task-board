import React, { Component } from 'react';
// import './App.css';
import { Grid, Menu, Header, Segment} from 'semantic-ui-react';
import TaskList from './scenes/TaskList/TaskList.js';
import GameBoard from './scenes/GameBoard/GameBoard.js';
import Inventory from './scenes/Inventory/Inventory.js';
// import TaskApi from '../../services/API/TaskApi.js';
import axios from 'axios';
import {observer} from 'mobx-react';
import userStore from '../../services/mobX/userStore.js';

function NavBar(props) {
  return (
    <Menu>
      <Menu.Item>Our Company</Menu.Item>
      <Menu.Item>Item 2</Menu.Item>
      <Menu.Item>About</Menu.Item>
    </Menu>
  )
}

@observer
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      supers : [],
      items: [],
      currentTask: null,
      previousTasks: [],
      completedTasks: [],
      gold: 0
    };

    this.handleEditListItem = this.handleEditListItem.bind(this);
    this.getNewTask = this.getNewTask.bind(this);
    this.completedTask = this.completedTask.bind(this);
  }

  componentDidMount() {
    axios.get('user/Items/')
    .then((res) => {
      console.log("Obtained data from server",res.data);
      this.setState({items : res.data});
    })
    .catch((err) => console.log(err));
  }

  handleEditListItem(listName, taskID, newObj) {
    if (listName  === "Tasks") {
      axios.patch("/user/lists/${listName}", newObj)
      .then((ret) => console.log(ret))
      .catch((err) => console.log(err));
      let newArray = this.state.tasks.slice();
      let index = newArray.findIndex((element) => {
        return element.id === taskID;
      });
      newArray[index] = newObj;
      this.setState({tasks: newArray});
    }
  }


  completedTask(task, elapsed) {
    console.log("Worked on task", task, "for ", elapsed, "seconds");
    let newList = this.state.completedTasks.slice();
    newList.push({task, elapsed: task.time - elapsed});
    this.setState({completedTasks : newList});
    console.log("List looks like: ", this.state.completedTasks);
  }

  getNewTask() {
    if (this.state.tasks.length > 0) {
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
        <Inventory items={this.state.items}/>
        <GameBoard tasks={userStore.Tasks} getTask={this.getNewTask} currentTask={this.state.currentTask} completedTask={this.completedTask}></GameBoard>
        <Grid columns='equal' stackable={true}>
          <Grid.Row>
            <Grid.Column>
              <TaskList name="Tasks" list={userStore.Tasks}></TaskList>
            </Grid.Column>
            <Grid.Column>
              <TaskList name="Habits" list={userStore.Habits} items={this.state.items}></TaskList>
            </Grid.Column>
            <Grid.Column>
              <TaskList name="Supers" list={userStore.Tasks}></TaskList>
            </Grid.Column>
          </Grid.Row>
      </Grid>
      </div>
    );
  }
}

export default App;
