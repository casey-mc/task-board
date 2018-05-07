import React, { Component } from 'react';
import Inventory from '../Inventory/Inventory.js';
import {observer, inject} from 'mobx-react';
import {TaskTable} from './TaskTable.js';

  @observer
  class TaskTableContainer extends Component {
    // The state for the list is the JSON {taskID, taskContent, taskTime} list
    constructor(props){
      super(props);
      this.state = {
        selected: -1
        }
        this.changeSelected = this.changeSelected.bind(this);
      }

      changeSelected(index) {
        this.setState({selected : index});
      }

    render() {

      return(
        <TaskTable
        selected={this.state.selected}
        changeSelected={this.changeSelected}
        />
      )
    }
  }

export default TaskTableContainer;