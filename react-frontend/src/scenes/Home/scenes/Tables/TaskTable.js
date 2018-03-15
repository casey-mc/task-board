import React, { Component } from 'react';
import SegmentGroup, { Button, Table, Label, Form, Input, Dropdown, Header, Segment, Modal, Icon } from 'semantic-ui-react';
import Inventory from '../Inventory/Inventory.js';
import {observer} from 'mobx-react';
// import userStore from '../../../../services/mobX/userStore.js';



class TaskInput extends Component {
    constructor(props){
      super(props);
      this.state = {
        task: "",
        time: "",
        item_id: null
        };
  
        this.handleChange = this.handleChange.bind(this);
        this.submitTask = this.submitTask.bind(this);
        this.addHabit = this.addHabit.bind(this);
      }
  
      handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;
        if (name === 'time') {
          value = parseInt(value, 10);
        }
        this.setState({
          [name]: value
        });
      }

      addHabit(id) {
        this.setState({item_id: id});
      }
  
      submitTask(event) {
        if (this.state.task !== "" && this.state.time > 0) {
          this.props.list.addItem(this.state);
            this.setState({
              task: "",
              time: "",
              item_id: null
              });
        } else {
          alert("A Task needs a description and a time");
        }
      }
  
      render() {
        return(
          <React.Fragment>
          <Table.Cell>
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
              </Form.Group>
            </Form>
          </Table.Cell>
          <Table.Cell>
            <Form.Field>
              <Button onClick={this.submitTask}>+</Button>
            </Form.Field>
          </Table.Cell>
          </React.Fragment>
        )
      }
  }
  
  @observer
  class TaskTable extends Component {
    // The state for the list is the JSON {taskID, taskContent, taskTime} list
    constructor(props){
      super(props);
      this.state = {
        selectedTask: null
      }
      }
  
    render() {

      return(
      <Table basic={true} celled collapsing style={{background: "#ebebd3"}}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Tasks</Table.HeaderCell>
            <Table.HeaderCell>Options</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
  
        <Table.Body>
          <Table.Row>
              <TaskInput list={this.props.list} items={"items" in this.props && this.props.items}></TaskInput>
          </Table.Row>
          {this.props.list.list.map((task, index)=>
            <Table.Row key={task.id}>
          
            {index === this.state.selectedTask
            ?
            <TaskInput></TaskInput>
            :
            <Table.Cell style={{padding: '1px'}} color='teal'>
            <Segment.Group horizontal style={{padding: '1px', background: '#00bcea'}}>
              <Segment style={{width: '75%'}}>{task.task}</Segment>
              <Segment>{task.time}</Segment>
           </Segment.Group>
          </Table.Cell>
           
            }

          <Table.Cell>
          <Dropdown icon='ellipsis vertical' style={{flexGrow: 0}}>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => this.editTask(index)}>Edit</Dropdown.Item>
                <Dropdown.Item onClick={() => this.props.list.deleteItem(task.id)}>Delete</Dropdown.Item>
              </Dropdown.Menu>
              </Dropdown>
          </Table.Cell>
        </Table.Row>)}
        </Table.Body>
      </Table>
      )
    }
  }

export default TaskTable;