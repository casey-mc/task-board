import React, { Component } from 'react';
// import './App.css';
import { Grid, Menu } from 'semantic-ui-react';
import HabitTable from './scenes/Tables/HabitTable.js';
import TaskTableContainer from './scenes/Tables/TaskTableContainer.js';
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


  handleEditListItem(listName, taskID, newObj) {
    if (listName  === "Tasks") {
      axios.patch("/lists/listName", newObj)
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
        <Provider items={userStore.Inventory}>
          <Inventory/>
        </Provider>
        <Provider list={userStore.Tasks}>
          <GameBoard/>
        </Provider>
        <Grid columns='equal' stackable={true}>
          <Grid.Row>
            <Grid.Column>
            <Provider list={userStore.Tasks}>
              <TaskTableContainer/>
            </Provider>
            </Grid.Column>

            <Grid.Column>
              <Provider list={userStore.Habits} items={userStore.Inventory}>
                <HabitTable/>
              </Provider>
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
