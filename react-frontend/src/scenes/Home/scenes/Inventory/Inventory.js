import React, { Component } from "react";
import { Button, Header, Segment, Popup, Icon, Modal } from "semantic-ui-react";

class Inventory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null
    };
  }

  selectedItem(index) {
    this.setState({
      selected: index
    });
    if ("addHabit" in this.props) {
      this.props.addHabit(index);
    }
  }

  render() {
    return (
      <Segment.Group
        horizontal
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))"
        }}
      >
        {"items" in this.props &&
          this.props.items.map((value, index) => {
            return (
              <Button key={value.id} onClick={() => this.selectedItem(value.id)}>
                <Segment raised style={{ flexGrow: 0 }}>
                  <Header as="h4">
                    {value.name}
                    <Icon name={value.image} />
                  </Header>
                  {value.description}
                </Segment>
              </Button>
            );
          })}
        {/* <Segment style={{flexGrow: 1}}/> */}
      </Segment.Group>
    );
  }
}

export default Inventory;
