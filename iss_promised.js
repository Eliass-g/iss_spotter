const database = require('mime-db');
const request = require('request-promise-native');

const fetchMyIP = function() {
  return request('https://api.ipify.org?format=json');
};

const fetchCoordsByIP = function(ip) {
  const IP = JSON.parse(ip).ip;
  return request(`http://ipwho.is/${IP}`);
};

 const fetchISSFlyOverTimes = function(coords) {
  const coordinates = {
    latitude: JSON.parse(coords).latitude,
    longitude: JSON.parse(coords).longitude
  };
  return request(`https://iss-flyover.herokuapp.com/json/?lat=${coordinates.latitude}&lon=${coordinates.longitude}`);
};

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
  .then(fetchCoordsByIP)
  .then(fetchISSFlyOverTimes)
  .then((data) => {
    const result = JSON.parse(data).response;
    return result;
  });
}; 

module.exports = { nextISSTimesForMyLocation };