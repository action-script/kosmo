const HTTPLoader = require('./http.js');

class OBJLoader extends HTTPLoader {
   constructor(id = null) {
      super(`/api/item/${id}`);
   }
}

module.exports = OBJLoader;
