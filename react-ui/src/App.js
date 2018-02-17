import React, { Component } from 'react';
// import { CSSTransitionGroup } from 'react-transition-group';
import {TransitionMotion, spring, presets} from 'react-motion'
import { Collapse, UnmountClosed } from 'react-collapse';
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

  removeClicked(r) {
    socket.emit('clientRemovedRestaurant', r);
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

      // let backButton = null;
      // if (status > 0) {
      //   backButton = <i onClick={() => this.backClicked()} className='fas fa-angle-left'></i>;
      // }

      // let editButton = null;
      // if (status < 1 && selected[0] === undefined) {
      //   let editIconClassName='fas fa-cog';
      //   if (status ===  -1) {
      //     editIconClassName = 'fas fa-check';
      //   }
      //   editButton =
      //     <i className={editIconClassName}
      //                   onClick={() => this.editClicked()}>
      //     </i>
      //   ;
      // }

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

      let doneButtonShow = () => {
        if (status === -1) {
          return <i className='fas fa-check' onClick={() => this.editClicked()}></i>
        }
      }

      return(
        <div className='App'>
          <nav className='navbar sticky-top navbar-light bg-white border-bottom'>
            <a className='navbar-brand' href='#' onClick={() => this.homeClicked()}><h1><strong>FiveTwoOne</strong></h1></a>
            <div className='buttonControl'>
              {backButtonShow()}
              {editButtonShow()}
              {doneButtonShow()}
            </div>
          </nav>
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
                      <div className='col'>{step}</div>
                      <div className='col' style={{textAlign: 'right'}}>{removeIcon(step)}</div>
                    </div>
                  </Collapse>
                );
              })}
            </div>
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
