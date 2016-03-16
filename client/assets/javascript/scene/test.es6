var GLWeb = require('../glweb/main.js');
var Render = require('../glweb/render.js');
var gl = GLWeb.gl;

class Scene {
   init(params) {
      this.scene = this.unpackScene(params.object);
      // TODO: render all processor (normals, difuse)
      this.scene_render = new Render({
         shader: params.shader,
         result_target: params.result_target,
         draw: () => { this.scene.draw(); },
         uniforms: {
            projection: {type: 'mat4', data: params.camera.getProjectionMatrix()},
            view: {type: 'mat4', data: params.camera.getViewMatrix()},
            color: [0.3, 0.8, 0.7]
         }
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
