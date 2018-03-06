const MongoClient = require('mongodb').MongoClient;
const mongodbUri = "mongodb+srv://bbaumgartner21:Camera21!@cluster0-rkwks.mongodb.net/test";
const dbName = 'ftodb';
const collectionName = 'devices';

module.exports = { MongoClient, mongodbUri, dbName, collectionName };