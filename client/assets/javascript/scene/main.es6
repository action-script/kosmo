const Scene = require('./scene.js');
const Graph = require('./graph.js');
const Loader = require('../loaders/main.js');
const SceneEditor = require('../editor/transformeditor.js');
const Pointer = require('./pointer.js'); 

class SceneManager {
   constructor(camera) {
      this.camera = camera;
      this.current_scene = { render: function() {}};
      this.pointer = new Pointer();
   }

   createScene(id = null) {
      // TODO: real loading screen
      // display loading screen
      this.current_scene = {  render: function() {
         console.log('Loading: ' + Loader.getLoadPercent());
         }
      };

      try {
         var scene = new Scene(id);
         scene.camera = this.camera;
 
         var graph = new Graph({
            scene: scene
         });

         scene.loadScene( () => {
            // remove loading screen
            graph.init();
            this.current_scene = graph;
         });

         this.editor = new SceneEditor(scene);
      }
      catch (error) {
         console.log('Error on Scene initialization', error);
      }
   }

   render(time, current) {
      this.current_scene.render();
      // render interface
      this.pointer.display();
   }  
}

module.exports = SceneManager;
