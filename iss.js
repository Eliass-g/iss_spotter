/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require('request');

const fetchMyIP = function (callback) {
  // use request to fetch IP address from JSON API
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const IP = JSON.parse(body).ip;
    callback(null, IP);
  });
};

const fetchCoordsByIP = function (IP, callback) {
  request(`http://ipwho.is/${IP}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (!JSON.parse(body).success) {
      const message = `Success status was ${JSON.parse(body).success}. Server message says: ${JSON.parse(body).message} when fetching for IP ${JSON.parse(body).ip}`;
      callback(Error(message), null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching location. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const coordinates = {
      latitude: JSON.parse(body).latitude,
      longitude: JSON.parse(body).longitude
    };

    callback(null, coordinates);

  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function (coords, callback) {
  request(`https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS pass times. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const data = JSON.parse(body).response;
    callback(null, data);
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function (callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      callback(error, null);
      return;
    }
    fetchCoordsByIP(ip, (error, coordinates) => {
      if (error) {
        callback(error, null);
        return;
      }
      fetchISSFlyOverTimes(coordinates, (error, times) => {
        if (error) {
          callback(error, null);
          return;
        }
        callback(null, times);
      });
    });
  });
}

module.exports = { nextISSTimesForMyLocation };