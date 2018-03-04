import React, { Component } from 'react';
import SegmentGroup, { Button, Table, Label, Form, Input, Dropdown, Header, Segment, Modal, Icon } from 'semantic-ui-react';
import Inventory from '../Inventory/Inventory.js';


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
            const newObj = Object.assign({},this.state);
            this.props.onNewTask(this.props.name, newObj);
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
        let habitRender = () => {
          if (this.props.name === "Habits") {
            return (
            <Table.Cell>
              <Modal trigger={<Button>Choose Item</Button>}>
                <Modal.Header>Select Item</Modal.Header>
                <Modal.Content >
                  <Modal.Description>
                    <Inventory items={this.props.items} addHabit={this.addHabit}/>
                    {console.log('creating Inventory from HabitList with items', this.props.items)}
                  </Modal.Description>
                </Modal.Content>
              </Modal>
            </Table.Cell>
          )
         }
        }
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
          {habitRender()}
          <Table.Cell>
            <Form.Field>
              <Button onClick={this.submitTask}>+</Button>
            </Form.Field>
          </Table.Cell>
          </React.Fragment>
        )
      }
  }
  
  class TaskList extends Component {
    // The state for the list is the JSON {taskID, taskContent, taskTime} list
    constructor(props){
      super(props);
      this.addHabit = this.addHabit.bind(this);
      }

  
      addHabit(item_id) {

      }
  
    render() {
      let habitRender = (task) => {
        if (this.props.name !== 'Habits') {
          return null;
        }
        let habitItem = () => {
          if (task.item_id !== null) {
            let itemIndex = task.item_id;
            return <Icon name={this.props.items.find((element) => {
              return element.id === itemIndex;
            }).image}/>;
          } else {
            return (
              <Modal trigger={<Button>Choose Item</Button>}>
              <Modal.Header>Select Item</Modal.Header>
              <Modal.Content >
                <Modal.Description>
                  <Inventory items={this.props.items} addHabit={this.addHabit}/>
                  {console.log('creating Inventory from HabitList with items', this.props.items)}
                </Modal.Description>
              </Modal.Content>
            </Modal>
            );
          }
        }
        return (
          <Table.Cell>
          {habitItem()}
          </Table.Cell>
        )
      }

      return(
      <Table basic={true} celled collapsing style={{background: "#ebebd3"}}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>{this.props.name}</Table.HeaderCell>
            {this.props.name === "Habits" && 
            <Table.HeaderCell>Item</Table.HeaderCell>
            }
            <Table.HeaderCell>Options</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
  
        <Table.Body>
          <Table.Row>
              <TaskInput onNewTask={this.props.onNewTask} name={this.props.name} items={"items" in this.props && this.props.items}></TaskInput>
          </Table.Row>
          {this.props.list.map((task)=>
        <Table.Row key={task.id}>
          <Table.Cell style={{padding: '1px'}} color='teal'>
          <Segment.Group horizontal style={{padding: '1px', background: '#00bcea'}}>
            <Segment style={{width: '75%'}}>{task.task}</Segment>
            <Segment>{task.time}</Segment>

          </Segment.Group>

          </Table.Cell>
          {habitRender(task)}
          <Table.Cell>
          <Dropdown icon='ellipsis vertical' style={{flexGrow: 0}}>
              <Dropdown.Menu>
                <Dropdown.Item>Edit</Dropdown.Item>
                <Dropdown.Item onClick={() => this.props.onDeleteTask(this.props.name, task.id)}>Delete</Dropdown.Item>
              </Dropdown.Menu>
              </Dropdown>
          </Table.Cell>
        </Table.Row>)}
        </Table.Body>
      </Table>
      )
    }
  }

export default TaskList;

            // {/* <div style={{display: 'flex', alignItems: 'center'}}>
            //   <div style={{border: '2px solid #2f3e56', borderRadius: '.5em',padding: '.66em', paddingLeft: '1em', background: '#ee964b', height: '100%', width: '75%', margin: 0}}>{task.task}</div>
            //   <div style={{border: '2px solid #2f3e56', background: '#ee964b', borderRadius: '.5em', padding: '.66em', paddingLeft: '1em'}}>{task.time}</div>
            //   <span style={{flexGrow: 1}}></span>
            //   <Dropdown icon='ellipsis vertical' style={{flexGrow: 0}}>
            //   <Dropdown.Menu>
            //     <Dropdown.Item>Edit</Dropdown.Item>
            //     <Dropdown.Item onClick={() => this.props.onDeleteTask(task.id)}>Delete</Dropdown.Item>
            //   </Dropdown.Menu>
            //   </Dropdown>
            // </div> */}

            //             {/* <Segment style={{width: '5%'}}> */}
            // {/* <Dropdown icon='ellipsis vertical' style={{flexGrow: 0}}>
            //   <Dropdown.Menu>
            //     <Dropdown.Item>Edit</Dropdown.Item>
            //     <Dropdown.Item onClick={() => this.props.onDeleteTask(this.props.name, task.id)}>Delete</Dropdown.Item>
            //   </Dropdown.Menu>
            //   </Dropdown> */}
            // {/* </Segment> */