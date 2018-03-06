const db = require('../db');
const { svrmsg, svrerr } = require('../util');

class Data {
  constructor() {
    this.restaurants = [];
  }

  async init(cb) {
    try {
      this.restaurants = await this.getAllRestaurants();
      cb();
    } catch(error) {
      svrerr('Error initializing RestaurantCollection.', error);
    }
  }

  async getAllRestaurants() {
    try {
      const restaurants = await atlas.getAllRestaurants();
      restaurants.sort();
      this.restaurants = restaurants;
    } catch(error) {
      svrerr('Error getting restaurants from database.', error);
    }
  }

  async addRestaurant(name) {
    try {
      await atlas.addRestaurants([name]);
      this.restaurants = await this.getAllRestaurants();
    } catch(error) {
      svrerr('Error adding restaurant.', error);
    }
  }

  async removeRestaurant(name) {
    try {
      await atlas.deleteRestaurants([name]);
      this.restaurants = await this.getAllRestaurants();
    } catch(error) {
      svrerr('Error removing restaurant.', error);
    }
  }
}

module.exports = Data;