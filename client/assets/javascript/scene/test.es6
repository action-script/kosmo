var GLWeb = require('../glweb/main.js');
var Render = require('../glweb/render.js');
var gl = GLWeb.gl;

class Scene {
   init(params) {
      this.scene = this.unpackScene(params.object);
      // TODO: render all processor (normals, difuse) 
      this.scene_render = new Render({
         shader: params.shader,
         draw: () => { this.scene.draw(); }
      });
   }

   unpackScene(scene) {
      // TODO: preprocess all object matrices on the tree
      return scene;
   }

   render() {
      this.scene_render.render();
   }
}

module.exports = new Scene();
