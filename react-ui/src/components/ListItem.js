import React from 'react';
import { Collapse } from 'react-collapse';
import clientEmit from '../js/ioApi.js';

class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editing: false }
  }

  listItemClicked = (id) => {

  };

  removeClicked = (id) => {
    clientEmit('clientRemove', id);
  };

  render() {
    const { id, text, render, active, editMode } = this.props;

    let className = 'list-group-item';
    if (active) {
      className += ' active';
    }

    let removeIcon = (restaurant) => {
      return null;
    }
    if (status === -1) {
      removeIcon = (restaurant) => {
        return (
          <i key={restaurant}
             onClick={() => this.removeClicked(restaurant)}
             className='fas fa-times'>
          </i>
        );
      }
    }

    return (
      <Collapse className={className} key={id} onClick={() => this.listItemClicked(id)}>
        <div className='row' id='somePadding'>
          <input></input>
        </div>
      </Collapse>
    );
  }
}

export default ListItem;