
// return random integer between 0 and u
export function randomInteger(u) {
  return Math.floor(Math.random() * u);
}

// return random integer from l to u
export function randomIntegerFromRange(l,u) {
  return Math.floor(Math.random() * (u - l) + l);
}

// return random v4 uuid
export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// given an array of numbers, return the sum of the array values
export function sum(array) {
  return array.reduce((accum,elem) => accum + elem,0);
}

// shuffle the given array in place
export function shuffle(array) {
  var currentIndex = array.length;
  var temporaryValue = null;
  var randomIndex = null;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = randomInteger(currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
