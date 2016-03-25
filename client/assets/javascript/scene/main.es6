const Scene = require('./scene.js');
const Graph = require('./graph.js');
const Loader = require('../loaders/main.js');

class SceneManager {
   constructor() {
      this.current_scene = { render: function() {}};
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
 
         var graph = new Graph({
//            camera: camera,
//            shader: test_shader,
            scene: scene
//            result_target: {
//               color: color_result,
//               depth: depth_result
//            }
         });

         scene.loadScene( () => {
            // remove loading screen
            //graph.init();
            this.current_scene = graph;
         });

      }
      catch (error) {
         console.log('Error on Scene initialization', error);
      }
   }

   render(time, current) {
      this.current_scene.render();
      // render interface
   }  
}

module.exports = SceneManager;
