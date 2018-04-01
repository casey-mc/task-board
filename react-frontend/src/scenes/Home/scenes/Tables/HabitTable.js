import React, { Component } from "react";
import {
  Button,
  Table,
  Form,
  Input,
  Dropdown,
  Segment,
  Modal,
  Icon
} from "semantic-ui-react";
import Inventory from "../Inventory/Inventory.js";
import { observer } from "mobx-react";
// import userStore from '../../../../services/mobX/userStore.js';

class TaskInput extends Component {
  constructor(props) {
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
    if (name === "time") {
      value = parseInt(value, 10);
    }
    this.setState({
      [name]: value
    });
  }

  addHabit(id) {
    this.setState({ item_id: id });
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
    return (
      <Table.Row>
        <Table.Cell>
          <Form>
            <Form.Group inline>
              <Form.Field style={{ marginRight: "0", paddingRight: "0" }}>
                <Input
                  placeholder="Add a new task"
                  onChange={this.handleChange}
                  name="task"
                  value={this.state.task}
                />
              </Form.Field>
              <Form.Field style={{ paddingLeft: "0" }}>
                <Input
                  label={{ basic: true, content: "min" }}
                  labelPosition="right"
                  placeholder="Time"
                  name="time"
                  value={this.state.time}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <Modal trigger={<Button>Choose Item</Button>}>
                  <Modal.Header>Select Item</Modal.Header>
                  <Modal.Content>
                    <Modal.Description>
                      <Inventory
                        items={this.props.items}
                        addHabit={this.addHabit}
                      />
                    </Modal.Description>
                  </Modal.Content>
                </Modal>
              </Form.Field>
              <Form.Field>
                <Button onClick={this.submitTask}>+</Button>
              </Form.Field>
            </Form.Group>
          </Form>
        </Table.Cell>
      </Table.Row>
    );
  }
}

class TableRow extends Component {
  render() {
    let itemButton = <Button>Choose Item</Button>;
    if (this.props.icon !== "") {
      itemButton = <Button icon={this.props.icon}/>
    }
    return (
      <Table.Row>
        {/* {index === this.state.selectedTask ? (
          <TaskInput />
        ) : (
          <Table.Cell style={{ padding: "1px" }} color="teal">
            <Segment.Group
              horizontal
              style={{ padding: "1px", background: "#00bcea" }}
            >
              <Segment style={{ width: "75%" }}>{task.task}</Segment>
              <Segment>{task.time}</Segment>
            </Segment.Group>
          </Table.Cell>
        )} */}

        <Table.Cell style={{ padding: "1px" }} color="teal">
          <Segment.Group
            horizontal
            style={{ padding: "1px", background: "#00bcea" }}
          >
            <Segment style={{ width: "75%" }}>{this.props.description}</Segment>
            <Segment>{this.props.time}</Segment>
            <Modal trigger={itemButton}>
              <Modal.Header>Select Item</Modal.Header>
              <Modal.Content>
                <Modal.Description>
                  <Inventory
                    items={this.props.items}
                    addHabit={this.editHabit}
                  />
                </Modal.Description>
              </Modal.Content>
            </Modal>
            {/* <Icon
              name={
                this.props.items.find(element => {
                  return element.id === itemIndex;
                }).image
              }
            /> */}
            <Segment>
              <Dropdown icon="ellipsis vertical" style={{ flexGrow: 0 }}>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => this.editTask()}>
                    Edit
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => this.props.list.deleteItem(this.props.key)}
                  >
                    Delete
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Segment>
          </Segment.Group>
        </Table.Cell>
      </Table.Row>
    );
  }
}

@observer
class HabitTable extends Component {
  // The state for the list is the JSON {taskID, taskContent, taskTime} list
  constructor(props) {
    super(props);
    this.state = {
      selectedTask: null
    };
  }

  render() {

    return (
      <Table basic={true} celled collapsing style={{ background: "#ebebd3" }}>
        {/* Header */}
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Habits</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        {/* Body */}
        <Table.Body>
          <TaskInput
            list={this.props.list}
            items={"items" in this.props && this.props.items}
          />

          {this.props.list.list.map((habit, index) => {
            let icon = this.props.items.find(element => {
                return element.id === habit.id;
              })
            if (icon === undefined) {
              icon = "";
            } else {
              icon = icon.image;
            }
            return <TableRow key={habit.id} description={habit.task} time={habit.time} icon={icon}/>;
          })}
        </Table.Body>
      </Table>
    );
  }
}

export default HabitTable;
