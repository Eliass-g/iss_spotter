const { date } = require('assert-plus');
const { nextISSTimesForMyLocation } = require('./iss');

/* fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }
  console.log('It worked! Returned IP:', ip);
});

fetchCoordsByIP('199.212.66.161', (error, data) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }
  console.log('It worked! Returned coordinates:', data);
});

fetchISSFlyOverTimes({ latitude: 43.653226, longitude: -79.3831843 }, (error, data) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }
  console.log(data);
}); */

nextISSTimesForMyLocation((error, results) => {
  if (error) {
    console("It didn't work!", error);
    return;
  }
  for (let el of results) {
    const time = new Date(0);
    time.setUTCSeconds(el.risetime);
    console.log(`Next pass at ${time} for ${el.duration} seconds!`);
  }
});