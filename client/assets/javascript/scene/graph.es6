var GLWeb = require('../glweb/main.js');
const Render = require('../glweb/render.js');
const Shader = require('../glweb/shader.js');
const Texture = require('../glweb/texture.js');
const RenderBuffer = require('../glweb/renderbuffer.js');
var gl = GLWeb.gl;


class Graph {
   constructor(params) {
      Object.assign(this, params);
   }

   init() { 
      var color_result = new Texture();
      var depth_result = new RenderBuffer(RenderBuffer.DEPTH);
      // TODO: render all processor (normals, difuse)
      this.scene_render = new Render({
         shader: Shader.basic,
         result_target: {
            color: color_result,
            depth: depth_result
         },
         depth: true,
         cull: gl.BACK,
         draw: () => { this.scene.draw(); },
         uniforms: {
            projection: {type: 'mat4', data: this.scene.camera.projectionMatrix},
            view: {type: 'mat4', data: this.scene.camera.viewMatrix},
            color: [0.3, 0.8, 0.7]
         }
      });

      this.screen_render = new Render({
         shader: Shader.screen_pass,
         cull: gl.BACK,
         samplers: {
            source: color_result
         }
      });
   }

   render() {
      // color scene render
      this.scene_render.render();

      // on screen fx pass
      this.screen_render.render();
   }
}

module.exports = Graph;
