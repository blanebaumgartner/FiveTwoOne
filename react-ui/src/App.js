import React, { Component } from 'react';
//import { CSSTransitionGroup } from 'react-transition-group';
//import logo from './logo.svg';
import './App.css';

import io from 'socket.io-client';

const socket = io();

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

  listItemClicked(item) {
    console.log('listItemClicked: ' + item);
    let selectedRestaurants = this.state.restaurants.selected;
    const i = selectedRestaurants.indexOf(item);
    if (i < 0) {
      selectedRestaurants.push(item);
    } else {
      selectedRestaurants.splice(i, 1);
    }

    this.setState((prevState) => {
      return {
        restaurants: {
          shown: prevState.restaurants.shown,
          selected: selectedRestaurants
        }
      };
    });
    socket.emit('clientClickedRestaurant', item);
  }

  homeClicked() {
    socket.emit('clientClickedReset');
  }

  render() {
    //const t = this.state.title;
    const r = this.state.restaurants;
    const noData = !this.state.receivedData;
    //const allowEditing = (r.selected[0] === undefined && t === 'Choose 5');

    if (noData) {
      return (
        <div>
          Loading
        </div>
      );
    } else {
      return(
        <div className='App'>
          <nav className='navbar sticky-top navbar-light bg-white border-bottom'>
            <div className='container'>
              <a className='navbar-brand' href='#' onClick={() => this.homeClicked()}><h1>FiveTwoOne</h1></a>
              <button className='navbar-text btn-sm btn-outline-secondary'>Edit</button>
            </div>
          </nav>
          <div className='container'>
            <ul className='list-group list-group-flush'>
              {r.shown.map((step) => {
                let listClassName = 'list-group-item';
                if (r.selected.indexOf(step) >= 0) {
                  listClassName += ' active';
                }
                return (
                  <li className={listClassName} key={step} onClick={() => this.listItemClicked(step)}>
                    {step}
                  </li>
                );
              })}
            </ul>
          </div>
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
