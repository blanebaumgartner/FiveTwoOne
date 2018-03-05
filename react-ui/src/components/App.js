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

    return(
      <div className='App'>
        <NavBar title={navBarTitle} status={this.state.status}/>
        <RestaurantList restaurants={this.state.restaurants} status={this.state.status} />
      </div>
    );
  }
}

export default App;
