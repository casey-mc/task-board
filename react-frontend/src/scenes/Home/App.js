import React, { Component } from 'react';
// import './App.css';
import { Grid, Menu } from 'semantic-ui-react';
import HabitTable from './scenes/Tables/HabitTable.js';
import TaskTable from './scenes/Tables/TaskTable.js';
import GameBoard from './scenes/GameBoard/GameBoard.js';
import Inventory from './scenes/Inventory/Inventory.js';
// import TaskApi from '../../services/API/TaskApi.js';
import axios from 'axios';
import {observer, Provider} from 'mobx-react';
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


  render() {
    return (
      <div>
        <NavBar></NavBar>
        <Inventory items={this.state.items}/>
        <Provider list={userStore.Tasks}>
        <GameBoard></GameBoard>
        </Provider>
        <Grid columns='equal' stackable={true}>
          <Grid.Row>
            <Grid.Column>
              <TaskTable name="Tasks" list={userStore.Tasks}></TaskTable>
            </Grid.Column>
            <Grid.Column>
              <HabitTable name="Habits" list={userStore.Habits} items={this.state.items}></HabitTable>
            </Grid.Column>
            <Grid.Column>
              {/* <TaskList name="Supers" list={userStore.Tasks}></TaskList> */}
            </Grid.Column>
          </Grid.Row>
      </Grid>
      </div>
    );
  }
}

export default App;
