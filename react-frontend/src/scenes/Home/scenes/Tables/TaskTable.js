import React, { Component } from "react";
import {
  Button,
  Table,
  Form,
  Input,
  Dropdown,
  Segment,
} from "semantic-ui-react";
import Inventory from "../Inventory/Inventory.js";
import { observer, inject } from "mobx-react";
// import userStore from '../../../../services/mobX/userStore.js';

@inject("list")
class TableInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      task: "",
      time: "",
      item_id: null
    };
  }

  handleChange(event) {
    let name = event.target.name;
    let value = event.target.value;
    if (name === "time") {
      value = parseInt(value, 10);
      if (isNaN(value)) {
        return;
      }
    }
    this.setState({
      [name]: value
    });
  }

  submitTask(event) {
    if (this.state.task !== "" && this.state.time > 0) {
      this.props.list.addItem(this.state);
      this.setState({
        task: "",
        time: ""
      });
    } else {
      alert("A Task needs a description and a time");
    }
  }

  render() {
    return (
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
            <Button onClick={this.submitTask}>+</Button>
          </Form.Field>
            </Form.Group>
          </Form>
        </Table.Cell>
    );
  }
}

@observer
class TableRow extends Component {
  render() {
    return (
      <Table.Row>
        <Table.Cell style={{ padding: "1px" }} color="teal">
          <Segment.Group
            horizontal
            style={{ padding: "1px", background: "#00bcea" }}
          >
            <Segment style={{ width: "75%" }}>{this.props.description}</Segment>
            <Segment>{this.props.time}</Segment>
            <Segment>
              <Dropdown icon="ellipsis vertical" style={{ flexGrow: 0 }}>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => this.props.changeSelected(this.props.id)}>
                    Edit
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => this.props.list.deleteItem(this.props.id)}>
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

@inject("list")
@observer
class TaskTable extends Component {
  render() {
    return (
      <Table basic={true} celled collapsing style={{ background: "#ebebd3" }}>
        {/* Header */}
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Tasks</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        {/* Body */}
        <Table.Body>
          <TableInput inputSubmit={this.props.inputSubmit} />
          {
            this.props.list.list.map((task, index) => {
              return (<TableRow key={task.id} description={task.task} time={task.time}/>)
            })
          }

        </Table.Body>
      </Table>
    );
  }
}

export { TaskTable };
// export default TaskTable;
