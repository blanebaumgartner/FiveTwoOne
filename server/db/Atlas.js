const MongoClient = require('mongodb').MongoClient;
const mongodbUri = "mongodb+srv://bbaumgartner21:Camera21!@cluster0-rkwks.mongodb.net/test";
const dbName = 'ftodb';
const collectionName = 'devices';

class Atlas {
  constructor() {

  }

  idsToDocs(ids) {
    return ids.map((id) => {
      return { _id: id };
    });
  }

  logAllRestaurants() {
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
  }

  async getAllRestaurants() {
    try {
      const client = await MongoClient.connect(mongodbUri);
      const collection = await client.db(dbName).collection(collectionName);
      const docs = await collection.find().toArray();
      const restaurants = docs.map((doc) => {
        return doc._id;
      });
      client.close();
      return restaurants;
    } catch(error) {
      console.log('error: ', error);
      return error;
    }
  }

  addRestaurants(restaurantArray) {
    if (restaurantArray[0] === undefined) {
      console.log('[DB]: No restaurants added.');
      return;
    }
    const docs = idsToDocs(restaurantArray);
    MongoClient.connect(mongodbUri, (err, client) => {
      client.db(dbName).collection(collectionName, (err, collection) => {
        collection.insertMany(docs);
        client.close();
      });
    });
  }

  deleteRestaurants(restaurantArray) {
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
  }

  _deleteAllRecords() {
    MongoClient.connect(mongodbUri, (err, client) => {
      client.db(dbName).collection(collectionName, (err, collection) => {
        collection.deleteMany({});
      });
      logAllRestaurants();
      client.close();
    });
  };
}

module.exports = Atlas;

//deleteArrayOfRestaurants(['']);
//logAllRestaurants();