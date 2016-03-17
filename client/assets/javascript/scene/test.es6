var GLWeb = require('../glweb/main.js');
const Render = require('../glweb/render.js');
var gl = GLWeb.gl;

class Scene {
   init(params) {
      this.scene = this.unpackScene(params.object);
      // TODO: render all processor (normals, difuse)
      this.scene_render = new Render({
         shader: params.shader,
         result_target: params.result_target,
         depth: true,
         draw: () => { this.scene.draw(); },
         uniforms: {
            projection: {type: 'mat4', data: params.camera.projectionMatrix},
            view: {type: 'mat4', data: params.camera.viewMatrix},
            color: [0.3, 0.8, 0.7]
         }
      });

      gl.enable(gl.CULL_FACE);
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
