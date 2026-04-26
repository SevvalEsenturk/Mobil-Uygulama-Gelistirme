// Web mock for @react-native-async-storage/async-storage
// Using Promise-based API instead of async/await to avoid regeneratorRuntime
var storage = {};

var AsyncStorage = {
  getItem: function(key) {
    return Promise.resolve(storage[key] || null);
  },
  setItem: function(key, value) {
    storage[key] = value;
    return Promise.resolve();
  },
  removeItem: function(key) {
    delete storage[key];
    return Promise.resolve();
  },
  clear: function() {
    Object.keys(storage).forEach(function(key) { delete storage[key]; });
    return Promise.resolve();
  },
  getAllKeys: function() {
    return Promise.resolve(Object.keys(storage));
  },
  multiGet: function(keys) {
    return Promise.resolve(keys.map(function(key) { return [key, storage[key] || null]; }));
  },
  multiSet: function(pairs) {
    pairs.forEach(function(pair) { storage[pair[0]] = pair[1]; });
    return Promise.resolve();
  },
  multiRemove: function(keys) {
    keys.forEach(function(key) { delete storage[key]; });
    return Promise.resolve();
  },
};

module.exports = AsyncStorage;
module.exports.default = AsyncStorage;
