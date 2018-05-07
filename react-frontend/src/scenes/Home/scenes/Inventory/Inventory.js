import React, { Component } from "react";
import { Button, Header, Segment, Popup, Icon, Modal } from "semantic-ui-react";
import { inject, observer } from "mobx-react";
import { observable } from "mobx";


@inject("items")
@observer
class Inventory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null
    };
  }

  selectedItem(itemID) {
    this.setState({
      selected: itemID
    });
    if ("selected" in this.props) {
      this.props.selected(itemID);
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
        {this.props.items.list.map((value, index) => {
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
