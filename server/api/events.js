const data = require('../data');

const reset = () => {
  data.reset();
};

const add = (data) => {
  data.add(data);
};

const remove = (data) => {
  data.remove(data);
};

const back = () => {
  data.back();
};

module.exports = { reset, add, remove, back };