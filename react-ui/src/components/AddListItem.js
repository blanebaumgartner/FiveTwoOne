import React from 'react';
import ListItem from './ListItem';

function AddListItem(props) {
  return <ListItem id="addNewItem" text={props.text} active={false} editing={true} />;
}