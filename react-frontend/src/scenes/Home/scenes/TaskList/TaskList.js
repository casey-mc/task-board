import React, { Component } from 'react';
import { Button, Table, Label, Form, Input, Dropdown} from 'semantic-ui-react';


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
          value = parseInt(value, 10);
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
        this.props.onNewTask(newObject);
      }
  
  
    render() {
  
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
          {this.props.tasks.map((task)=>
        <Table.Row key={task.id}>
          <Table.Cell>
            <Label>{task.task}</Label><Label>{task.time}</Label>
            <Dropdown icon='ellipsis vertical'>
            <Dropdown.Menu>
              <Dropdown.Item>Edit</Dropdown.Item>
              <Dropdown.Item onClick={() => this.props.onDelete(task.id)}>Delete</Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown>
            {/* <Button icon='ellipsis vertical'> */}
            {/* </Button> */}
          </Table.Cell>
        </Table.Row>)}
        </Table.Body>
      </Table>
      )
    }
  }

export default TaskList;