const onCollection = require('./onCollection.js');

const getAll = async () => {
  try {
    return onCollection(async (collection) => {
      const docs = await collection.find().toArray();
      const restaurants = docs.map((doc) => {
        return doc._id;
      });
      return restaurants;
    });
  } catch(error) {
    console.log('error: ', error);
    return error;
  }
}

const add = (restaurantArray) => {
  try {
    if (restaurantArray[0] === undefined) { return; }
    const docs = idsToDocs(restaurantArray);
    return onCollection((collection) => {
      collection.insertMany(docs);
    });
  } catch(error) {
    console.log('error: ', error);
    return error;
  }
}

const remove = (restaurantArray) => {
  try {
    onCollection((collection) => {
      restaurantArray.forEach((restaurant) => {
        const filter = { _id: restaurant };
        collection.deleteOne(filter);
      });
    });
  } catch(error) {
    console.log('error: ', error);
    return error;
  }
}

const idsToDocs = (ids) => {
  return ids.map((id) => {
    return { _id: id };
  });
}

module.exports = { getAll, add, remove };