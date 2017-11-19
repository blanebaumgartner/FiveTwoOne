import React, { Component } from 'react';
import { Menu, Container, Header, List, Step, Loader, Button, Segment, Icon, Sticky } from 'semantic-ui-react';
//import { CSSTransitionGroup } from 'react-transition-group';
//import logo from './logo.svg';
import './App.css';

import io from 'socket.io-client';

const socket = io();

const menuStyle = {

}

const listItemStyle = {
  fontSize: '0.9em'
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      receivedData: false,
      title: '',
      restaurants: {
        shown: [],
        selected: []
      }
    }
  }

  componentDidMount() {
    subscribeToServerUpdates((err, appData) => {
      this.setState({
        receivedData: true,
        title: appData.title,
        restaurants: appData.restaurants
      });
    });
  }

  render() {
    const t = this.state.title;
    const r = this.state.restaurants;
    const noData = !this.state.receivedData;
    const allowEditing = (r.selected[0] === undefined && t === 'Choose 5');

    if (noData) {
      return (
        <div className='Loader'>
          <Loader active></Loader>
        </div>
      );
    } else {
      return(
        <div className='App'>
          <Menu fixed='top' vertical borderless fluid>

              <Menu.Item>
                <Header floated='left' style={{ fontSize: '2em' }}>FiveTwoOne</Header>
                <Button color='red' basic compact floated='right' style={{ marginTop: '0.2em' }}>Edit</Button>
              </Menu.Item>
              <Menu.Item>
                <Step.Group size='mini' fluid unstackable>
                  <Step title='5' />
                  <Step title='2' />
                  <Step title='1' />
                </Step.Group>
              </Menu.Item>
          </Menu>
          <Container text style={{ paddingTop: '9em' }}>
            <List relaxed='very' divided verticalAlign='middle' size='big'>
              {r.shown.map((step) => {
                return (
                  <List.Item style={listItemStyle} key={step}>
                    <Icon name='remove' style={{ display: 'none' }}></Icon>
                    {step}
                  </List.Item>
                );
              })}
              <List.Item style={listItemStyle}></List.Item>
            </List>
          </Container>
        </div>
      );
    }
  }
}

export default App;

function subscribeToServerUpdates(cb) {
  socket.on('appDataUpdate', (appData) => {
    cb(null, appData);
  });
}
