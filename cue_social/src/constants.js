// function to set a constant ()
function define(name, value) {
  Object.defineProperty(exports, name, {
    value: value,
    enumerable: true
  });
}

// // For Prod:
define("ORIGIN", 'https://cuetavern.com')
define("ROUTE", 'https://cue-social.onrender.com');
// // define("ORIGIN2", 'https://cuetavern.netlify.app');

// For Development:
// define("ORIGIN", 'http://localhost:3000');
// define("ROUTE", 'http://localhost:3008');
// // define("ORIGIN2", 'http://localhost:3000');
