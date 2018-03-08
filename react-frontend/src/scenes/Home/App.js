import React, { Component } from 'react';
// import './App.css';
import { Grid, Menu, Header, Segment} from 'semantic-ui-react';
import TaskList from './scenes/TaskList/TaskList.js';
import GameBoard from './scenes/GameBoard/GameBoard.js';
import Inventory from './scenes/Inventory/Inventory.js';
// import TaskApi from '../../services/API/TaskApi.js';
import axios from 'axios';

function NavBar(props) {
  return (
    <Menu>
      <Menu.Item>Our Company</Menu.Item>
      <Menu.Item>Item 2</Menu.Item>
      <Menu.Item>About</Menu.Item>
    </Menu>
  )
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks : [],
      habits : [],
      supers : [],
      items: [],
      currentTask: null,
      previousTasks: [],
      completedTasks: [],
      gold: 0
    };

    this.handleNewListItem = this.handleNewListItem.bind(this);
    this.handleEditListItem = this.handleEditListItem.bind(this);
    this.getNewTask = this.getNewTask.bind(this);
    this.completedTask = this.completedTask.bind(this);
    this.handleDeleteListItem = this.handleDeleteListItem.bind(this);
  }

  componentDidMount() {
    axios.get('user/lists/Tasks/')
      .then((res) => {
        console.log("Obtained data from server",res.data);
        this.setState({tasks : res.data});
      })
      .catch((err) => console.log(err));
    axios.get('user/lists/Habits/')
      .then((res) => {
        console.log("Obtained data from server",res.data);
        this.setState({habits : res.data});
      })
      .catch((err) => console.log(err));
    axios.get('user/Items/')
    .then((res) => {
      console.log("Obtained data from server",res.data);
      this.setState({items : res.data});
    })
    .catch((err) => console.log(err));
  }

  // TODO: Post new info to DB, check if task is duplicate
  handleNewListItem(listName, newTask) {
    axios.post(`/user/lists/${listName}`, {
        task: newTask.task,
        time: newTask.time
      })
      .then((res) => {
        console.log("Successfully added ", newTask);
        newTask.id = res.data.id;
        if (listName === "Tasks") {
          const newList = this.state.tasks.slice();
          newList.push(newTask);
          this.setState({tasks: newList});
        } else if ( listName === "Habits") {
          const newList = this.state.habits.slice();
          newList.push(newTask);
          this.setState({habits: newList});
        }
      })
      .catch((err) => {
        console.log(err);
      });
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

  handleDeleteListItem(listName, taskID) {
    // Check if taskID is a valid item in this.state.tasks
    // Create new array without that index, setState
    // Call API delete
    let delIndex = undefined;
    let newArray = [];
    for (let i = 0; i < this.state.tasks.length; i++){
      if (taskID === this.state.tasks[i].id) {
        delIndex = i;
        break;
      }
    }
    if (delIndex !== undefined) {
      newArray = this.state.tasks.slice();
      newArray.splice(delIndex, 1);
      this.setState({tasks: newArray});
      // Call delete on API
      axios.delete(`/user/lists/${listName}`, {
        params : {
          id : taskID
        }
      })
      .then((resp) => console.log(resp))
      .catch((err) => console.log(err));
    } else {
      console.log("Invalid task ID");
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
        <GameBoard tasks={this.state.tasks} getTask={this.getNewTask} currentTask={this.state.currentTask} completedTask={this.completedTask}></GameBoard>
        <Grid columns='equal' stackable={true}>
          <Grid.Row>
            <Grid.Column>
              <TaskList name="Tasks" list={this.state.tasks}  onNewTask={this.handleNewListItem} onDeleteTask={this.handleDeleteListItem} onEditTask={this.handleEditListItem}></TaskList>
            </Grid.Column>
            <Grid.Column>
              <TaskList name="Habits" list={this.state.habits} onNewTask={this.handleNewListItem} onDeleteTask={this.handleDeleteListItem} onEditTask={this.handleEditListItem} items={this.state.items}></TaskList>
            </Grid.Column>
            <Grid.Column>
              <TaskList name="Supers" list={this.state.supers} onNewTask={this.handleNewListItem} onDeleteTask={this.handleDeleteListItem} onEditTask={this.handleEditListItem}></TaskList>
            </Grid.Column>
          </Grid.Row>
      </Grid>
      </div>
    );
  }
}

export default App;
