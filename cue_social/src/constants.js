// function to set a constant ()
function define(name, value) {
    Object.defineProperty(exports, name, {
      value: value,
      enumerable: true
    });
  }
  
  
  // For Development:
  define("ORIGIN", 'http://localhost:3000');
  define("RANDOM_SONG", 'http://localhost:3008/api/songs/random/random/');
  define("DAILY_SONG",'http://localhost:3008/api/dailysong/');
  define("ALL_SONGS", 'http://localhost:3008/api/songs/');
  define("ROUTE", 'http://localhost:3008');