const MongoClient = require('mongodb').MongoClient;
const mongodbUri = "mongodb+srv://bbaumgartner21:Camera21!@cluster0-rkwks.mongodb.net/test";
const dbName = 'ftodb';
const collectionName = 'devices';

// const fs = require('fs');
// const allRestaurants = require('./defaultRestaurants.json');

const logAllRestaurants = () => {
  MongoClient.connect(mongodbUri, (err, client) => {
    client.db(dbName).collection(collectionName, (err, collection) => {
      collection.find().toArray((err, docs) => {
        let restaurants = [];
        docs.forEach((doc) => {
          console.log(doc.restaurant);
          restaurants.push(doc.restaurant);
        });
      });
      client.close();
    });
  });
};

const getAllRestaurantsArray = new Promise((resolve, reject) => {
  MongoClient.connect(mongodbUri, (err, client) => {
    client.db(dbName).collection(collectionName, (err, collection) => {
      collection.find().toArray((err, docs) => {
        let restaurants = [];
        docs.forEach((doc) => {
          restaurants.push(doc.restaurant);
        });
        resolve(restaurants);
        client.close();
      });
    });
  });
});

const addArrayOfRestaurants = (restaurantArray) => {
  if (restaurantArray[0] === undefined) {
    console.log('DB: No restaurants added.');
    return;
  }
  let docs = [];
  restaurantArray.forEach((restaurant) => {
    docs.push({ restaurant: restaurant });
  });
  MongoClient.connect(mongodbUri, (err, client) => {
    client.db(dbName).collection(collectionName, (err, collection) => {
      collection.insertMany(docs, (err, result) => {
        // console.log(result.ops);
        // logAllRestaurants();
      });
    });
    client.close();
  });
};

const deleteArrayOfRestaurants = (restaurantArray) => {
  MongoClient.connect(mongodbUri, (err, client) => {
    client.db(dbName).collection(collectionName, (err, collection) => {
      restaurantArray.forEach((restaurant) => {
        const filter = { restaurant: restaurant };
        collection.deleteOne(filter)
        .then((result) => {
          console.log(result);
        });
      });
      logAllRestaurants();
    });
    client.close();
  });
};

const deleteAllRecords = () => {
  MongoClient.connect(mongodbUri, (err, client) => {
    client.db(dbName).collection(collectionName, (err, collection) => {
      collection.deleteMany({});
    });
    logAllRestaurants();
    client.close();
  });
};

module.exports.logAllRestaurants = logAllRestaurants;
module.exports.getAllRestaurantsArray = getAllRestaurantsArray;
module.exports.addArrayOfRestaurants = addArrayOfRestaurants;
module.exports.deleteArrayOfRestaurants = deleteArrayOfRestaurants;