import React from 'react';
import NavBarButton from './NavBarButton';
import '../css/NavBar.css';
import { clientEmit } from '../js/ioApi.js';

class NavBar extends React.Component {
  clientReset() {
    clientEmit('client-reset');
  }

  render() {
    const status = this.props.status;

    return (
      <nav className='navbar sticky-top navbar-light bg-white border-bottom'>
        <a className='navbar-brand' href='#' onClick={() => this.clientReset()}>
          <h1><strong>{this.props.title}</strong></h1>
        </a>
        <NavBarButton text={status} />
      </nav>
    );
  }
}

export default NavBar;