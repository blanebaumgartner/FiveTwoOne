import React from 'react';
import List from './List.js';

class RestaurantList extends React.Component {
  restaurantsToListItems(restaurants) {
    let listItems = [];
    restaurants.forEach((restaurant) => {
      listItems.push({
        id: restaurant.id,
        text: restaurant.name,
        render: restaurant.render,
        active: restaurant.selected
      });
    });
  }

  render() {
    const listItems = this.restaurantsToListItems(this.props.restaurants);
    const editMode = this.props.status === -1;
    const options = {
      addNewItemHint: "Add new restaurant..."
    }
    return (
      <List items={listItems} editMode={editMode} options={options} />
    );
  }
}

export default RestaurantList;