const onCollection = require('./onCollection.js');

const _deleteAllRecords = () => {
  onCollection((collection) => {
    collection.deleteMany({});
  });
  return null;
};

const _logAllRestaurants = async () => {
  onCollection((collection) => {
    const docs = await collection.find().toArray();
    docs.forEach((doc) => {
      console.log(doc._id);
    });
    return null;
  });
}