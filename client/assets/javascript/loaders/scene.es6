const HTTPLoader = require('./http.js');

class SceneLoader extends HTTPLoader {
   constructor(id = null) {
      // TODO: if no id. then random get.
      super(`/api/scene/${id}`);
   }
}

module.exports = SceneLoader;

