import React, { Component } from 'react';
// import Modal from 'react-modal';
// import { CSSTransitionGroup } from 'react-transition-group';
import {TransitionMotion, spring, presets} from 'react-motion'
import { Collapse } from 'react-collapse';
import './App.css';

import io from 'socket.io-client';

const socket = io();

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      receivedData: false,
      status: -1,
      all: [],
      shown: [],
      selected: [],
      addRestaurantValue: ''
    }


  }

  componentDidMount() {
    subscribeToServerUpdates((err, appData) => {
      this.setState({
        // receivedData: true,
        status: appData.status,
        all: appData.all,
        shown: appData.shown,
        selected: appData.selected
      });
    });

    this.nameInput.focus();
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

  updateAddRestaurantValue(evt) {
    this.setState({
      addRestaurantValue: evt.target.value
    });
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

  removeClicked(r) {
    socket.emit('clientRemovedRestaurant', r);
  }

  addClicked() {
    this.nameInput.focus();
  }

  addRestaurant(r) {
    if (r === null || r === '') {
      return;
    }
    this.nameInput.value = '';
    this.setState({
      addRestaurantValue: ''
    });
    document.getElementById('addRestaurantModal').modal('toggle');
    socket.emit('clientAddedRestaurant', r);
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
      const all = this.state.all;
      const shown = this.state.shown;
      const selected = this.state.selected;
      const status = this.state.status;

      let selectIcon = (restaurant) => {
        return null;
      }
      if (status === -1) {
        selectIcon = (restaurant) => {
          return <i onClick={() => this.selectClicked(restaurant)} className='fas fa-select'></i>;
        }
      }

      let backButtonShow = () => {
        if(status > 0) {
          return <i onClick={() => this.backClicked()} className='fas fa-angle-left'></i>;

        }
        return null;
      }

      let editButtonShow = () => {
        if (status === 0 && selected[0] === undefined) {
          return <i className='fas fa-cog' onClick={() => this.editClicked()}></i>
        }
        return null;
      }

      let addButtonShow = () => {
        if (status < 0) {
          return <i href='#addRestaurantModal' data-toggle='modal' className='fas fa-plus' onClick={() => this.addClicked()}></i>
        }
      }

      return(

        <div className='App'>
          
          {/* Add Restaurant Modal */}
          <div className='modal fade' id='addRestaurantModal' role='dialog' aria-labelledby='addRestaurantModalLabel' aria-hidden='true'>
            <div className='modal-dialog' role='document'>
              <div className='modal-content'>
                <div className='modal-header'>
                  <h5 className='modal-title' id='addRestaurantModalLabel'>Add Restaurant</h5>
                  <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                    <span aria-hidden='true'>&times;</span>
                  </button>
                </div>
                <div className='modal-body'>
                  <input ref={(input) => { this.nameInput = input; }} value={this.state.addRestaurantValue} onChange={evt => this.updateAddRestaurantValue(evt)}></input>
                  <i href='#' className='fas fa-check' onClick={() => this.addRestaurant(this.state.addRestaurantValue)}></i>
                </div>
              </div>
            </div>
          </div>

          <nav className='navbar sticky-top navbar-light bg-white border-bottom'>
            <a className='navbar-brand' href='#' onClick={() => this.homeClicked()}><h1><strong>FiveTwoOne</strong></h1></a>
            <div className='buttonControl'>
              {backButtonShow()}
              {editButtonShow()}
              {addButtonShow()}
            </div>
          </nav>

          {/* <input ref={(input) => {this.nameInput = input;}}></input> */}
          
          <div id='listGroupId' className='container'>
            <div className='list-group list-group-flush'>
              {all.map((step) => {
                let listClassName = 'list-group-item';
                if (selected.indexOf(step) >= 0) {
                  listClassName += ' active';
                }
                const isOpened = shown.indexOf(step) >= 0;
                
                let collapseId = 'noPadding';
                if (!isOpened) {
                  collapseId += '-noBorders';
                }

                return (
                  <Collapse isOpened={isOpened} id={collapseId} className={listClassName} key={step} onClick={() => this.listItemClicked(step)}>
                    <div className='row' id='somePadding'>
                      {selectIcon(step)}
                      {step}
                    </div>
                  </Collapse>
                );
              })}
            </div>
          </div>

          <footer class="footer">
            <div class="container">
              <span class="text-muted">Place sticky footer content here.</span>
            </div>
          </footer>
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
