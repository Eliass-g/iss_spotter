const { nextISSTimesForMyLocation } = require('./iss_promised');

const printTimes = function(result) {
  for (let el of result) {
    const time = new Date(0);
    time.setUTCSeconds(el.risetime);
    console.log(`Next pass at ${time} for ${el.duration} seconds!`);
  }
};

nextISSTimesForMyLocation()
  .then((result) => {
    printTimes(result);
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });