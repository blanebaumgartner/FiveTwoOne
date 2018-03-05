import React from 'react';
import { clientEmit } from '../js/ioApi.js';
import '../css/NavBarButton.css';

function NavBarButton(props) {
  return (
    <div className="NavBarButton">
      <button>{props.text}</button>
    </div>
  );
}

export default NavBarButton;