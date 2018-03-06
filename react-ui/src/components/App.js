import React from 'react';
import NavBar from './NavBar.js';
import RestaurantList from './RestaurantList.js';
import '../css/App.css';
import { clientOn } from '../js/ioApi.js'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 0,
      restaurants: []
    }
  }

  componentDidMount() {
    clientOn('statusUpdate', (status) => {
      this.setState({ status: status });
    });

    clientOn('restaurantUdpate', (restaurants) => {
      this.setState({ restaurants: restaurants });
    });
  }

  render() {
    let navBarTitle = 'FiveTwoOne';
    const restaurants = this.state.restaurants;
    const status = this.state.status;

    return(
      <div className='App'>
        <NavBar title={navBarTitle} status={status} />
        <RestaurantList restaurants={restaurants} status={status} />
      </div>
    );
  }
}

export default App;
