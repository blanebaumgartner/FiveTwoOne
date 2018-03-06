const { MongoClient, mongodbUri, dbName, collectionName } = require('./mongo.js');

module.exports = async function onCollection(cb) {
  const client = await MongoClient.connect(mongodbUri);
  const collection = await client.db(dbName).collection(collectionName);
  const result = await cb(collection);
  client.close();
  return result;
};