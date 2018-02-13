import React, { Component } from 'react';
// import { CSSTransitionGroup } from 'react-transition-group';
import {TransitionMotion, spring, presets} from 'react-motion'
import './App.css';

import io from 'socket.io-client';

const socket = io();

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      receivedData: false,
      status: -1,
      shown: [],
      selected: []
    }
  }

  componentDidMount() {
    subscribeToServerUpdates((err, appData) => {
      this.setState({
        // receivedData: true,
        status: appData.status,
        shown: appData.shown,
        selected: appData.selected
      });
    });
  }

  listItemClicked(item) {
    console.log('listItemClicked: ' + item);
    let selected = this.state.selected;
    const i = selected.indexOf(item);
    if (i < 0) {
      selected.push(item);
    } else {
      selected.splice(i, 1);
    }

    this.setState((prevState) => {
      return {
        selected: selected
      };
    });
    socket.emit('clientClickedRestaurant', item);
  }

  homeClicked() {
    socket.emit('clientClickedReset');
  }

  backClicked() {
    socket.emit('clientClickedBack');
  }

  editClicked() {
    socket.emit('clientClickedEdit');
  }

  removeClicked() {

  }

  render() {
    const {status, shown, selected} = this.state;

    if (false) {

      return (
        <div>
          Loading
        </div>
      );

    } else {

      const shown = this.state.shown;
      const selected = this.state.selected;
      const status = this.state.status;

      let backButton = null;
      if (status > 0) {
        backButton = <button className='navbar-text btn-sm btn-outline-secondary' onClick={() => this.backClicked()}>Back</button>;
      }

      let editButton = null;
      if (status < 1 && selected[0] === undefined) {
        let text = 'Edit';
        if (status ===  -1) {
          text = 'Done';
        }
        editButton = <button className='navbar-text btn-sm btn-outline-secondary' onClick={() => this.editClicked()}>{text}</button>;
      }

      let removeIcon = (restaurant) => {
        return null;
      }
      if (status === -1) {
        removeIcon = (restaurant) => {
          return ( <i key={restaurant} onClick={() => this.removeClicked(restaurant)} className='fas fa-trash-alt'></i> );
        }
      }

      return(
        <div className='App'>
          <nav className='navbar sticky-top navbar-light bg-white border-bottom'>
            <div className='container'>
              <a className='navbar-brand' href='#' onClick={() => this.homeClicked()}><h1>FiveTwoOne</h1></a>
              {backButton}
              {editButton}
            </div>
          </nav>
          <div className='container'>
            <ul className='list-group list-group-flush'>
              {shown.map((step) => {
                let listClassName = 'list-group-item';
                if (selected.indexOf(step) >= 0) {
                  listClassName += ' active';
                }
                return (
                  <li className={listClassName} key={step} onClick={() => this.listItemClicked(step)}>
                    <div className='row'>
                      <div className='col'>{step}</div>
                      <div className='col' style={{textAlign: 'right'}}>{removeIcon(step)}</div>
                    </div>
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
