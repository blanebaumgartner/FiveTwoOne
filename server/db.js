const MongoClient = require('mongodb').MongoClient;
const mongodbUri = "mongodb+srv://bbaumgartner21:Camera21!@cluster0-rkwks.mongodb.net/test";
const dbName = 'ftodb';
const collectionName = 'devices';

// const fs = require('fs');
// const allRestaurants = require('./defaultRestaurants.json');

const idArrayToDocs = (idArray) => {
  let docs = [];
  idArray.forEach((itemId) => {
    docs.push({ _id: itemId });
  });
  return docs;
};

const logAllRestaurants = () => {
  MongoClient.connect(mongodbUri, (err, client) => {
    client.db(dbName).collection(collectionName, (err, collection) => {
      collection.find().toArray((err, docs) => {
        docs.forEach((doc) => {
          console.log(doc._id);
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
          restaurants.push(doc._id);
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
  const docs = idArrayToDocs(restaurantArray);
  MongoClient.connect(mongodbUri, (err, client) => {
    client.db(dbName).collection(collectionName, (err, collection) => {
      collection.insertMany(docs);
      client.close();
    });
  });
};

const deleteArrayOfRestaurants = (restaurantArray) => {
  MongoClient.connect(mongodbUri, (err, client) => {
    client.db(dbName).collection(collectionName, (err, collection) => {
      restaurantArray.forEach((restaurant) => {
        const filter = { _id: restaurant };
        collection.deleteOne(filter)
        .then((result) => {

        });
      });
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

deleteArrayOfRestaurants(['']);
logAllRestaurants();