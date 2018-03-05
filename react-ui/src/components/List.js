import React from 'react';
import ListItem from './ListItem';
import AddListItem from './AddListItem';

class List extends React.Component {
  render() {
    const items = this.props.items;
    const options = this.props.options;

    const addNewItemHint = (() => {
      if (options.hasOwnProperty('addNewItemHint')) {
        return options.addNewItemHint;
      }
      return "Add new item...";
    })();

    const editMode = this.props.editMode;
    const addListItem = (() => {
      if (editMode) {
        return <AddListItem text={addNewItemHint} />
      }
      return null;
    })();
    return (
      <div id='listGroupId' className='container'>
        <div className='list-group list-group-flush'>
          {addListItem}
          {items.map((item) => {
            return (
              <ListItem id={item.id} text={item.text} render={item.render} active={item.active} editing={editMode} />
            );
          })}
        </div>
      </div>
    );
  }
}

export default List;