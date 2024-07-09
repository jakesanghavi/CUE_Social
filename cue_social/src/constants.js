// function to set a constant ()
function define(name, value) {
  Object.defineProperty(exports, name, {
    value: value,
    enumerable: true
  });
}

// For Prod:
define("ORIGIN", 'https://cuetavern.netlify.app');
define("ORIGIN2", 'https://cuetavern.com')
define("ROUTE", 'https://cue-social.onrender.com');

// For Development:
// define("ORIGIN", 'http://localhost:3000');
// define("ROUTE", 'http://localhost:3008');