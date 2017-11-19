class RestaurantSelection extends Component {
  render() {
    const r = this.props.restaurant;
    const selected = this.props.selected;
    let className = 'RestaurantSelectionContainer';
    if (selected) {
      className += ' RestaurantSelectedContainer';
    }

    const allowEditing = this.props.allowEdit;

    let buttonVisibility = 'hidden';
    if (allowEditing) {
      buttonVisibility = 'visible';
    }

    return (
      <div className={className}>
        <div className='RestaurantSelection' onClick={() => this.selectRestaurant(r)}>{r}</div>
        <button style={{visibility: buttonVisibility}} onClick={() => this.removeRestaurant(r)}>X</button>
      </div>
    );
  }

  selectRestaurant(r) {
    socket.emit('clientClickedRestaurant', r);
  }

  removeRestaurant(r) {
    const remove = window.confirm('Remove ' + r + '?');
    if (remove) {
      socket.emit('clientRemovedRestaurant', r);
    }
  }
}

class RestaurantAdder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: ''
    };
  }

  render() {
    return (
      <div className='RestaurantSelectionContainer'>
        <input
          value={this.state.inputValue}
          className='RestaurantAdder'
          placeholder='Add new restaurant...'
          onInput={evt => this.updateInputValue(evt)} />
        <div>
          <button onClick={() => this.addRestaurant()}>Add</button>
          <span>   </span>
          <button onClick={() => this.eraseInput()}>X</button>
        </div>
      </div>
    );
  }

  addRestaurant() {
    const newRestaurant = this.state.inputValue;
    if (newRestaurant === '') {
      return;
    }
    this.setState({
      inputValue: ''
    });
    socket.emit('clientAddedRestaurant', newRestaurant);
  }

  eraseInput() {
    this.setState({
      inputValue: ''
    });
  }

  updateInputValue(evt) {
    this.setState({
      inputValue: evt.target.value
    });
  }
}

class RestaurantList extends Component {
  render() {
    const shown = this.props.restaurants.shown;
    const selected = this.props.restaurants.selected;
    const allowEditing = this.props.allowEdit;

    let restaurantAdder = null;
    if (allowEditing) {
      restaurantAdder = <RestaurantAdder />;
    }

    return (
      <div className='RestaurantList'>
        {shown.map((step) => {
          return (
            <RestaurantSelection
              selected={!(selected.indexOf(step) === -1)}
              restaurant={step}
              key={step}
              allowEdit={allowEditing}
            />
          );
        })}
        {restaurantAdder}
      </div>
    );
  }
}

class HeaderBar extends Component {
  render() {
    return (
      <div className='HeaderBarContainer'>
        <div className='HeaderBar'>
          <button
            className='headerElement'
            onClick={() => socket.emit('clientClickedBack')}
            >Back</button>
          <div className='headerElement headerTitle'>{this.props.title}</div>
          <button
            className='headerElement'
            onClick={() => socket.emit('clientClickedReset')}
            >Reset</button>
        </div>
      </div>
    );
  }
}

class HeaderBarHidden extends Component {
  render() {
    return (
      <div className='HeaderBarContainerHidden' style={{visibility: 'hidden'}}>
        <div className='HeaderBar'>
          <button
            className='headerElement'
            onClick={() => socket.emit('clientClickedBack')}
            >Back</button>
          <div className='headerElement headerTitle'>{this.props.title}</div>
          <button
            className='headerElement'
            onClick={() => socket.emit('clientClickedReset')}
            >Reset</button>
        </div>
      </div>
    );
  }
}
