var GLWeb = require('../glweb/main.js');
const Mesh = require('../glweb/mesh.js');
const Render = require('../glweb/render.js');
const Shader = require('../glweb/shader.js');
const Helper = require('../helper.js');
var gl = GLWeb.gl;

class Sky {
   constructor(options) {
      var sky_mesh = new Mesh({
         buffers: [ Helper.full_screen.vertices]
      });

      // TODO: pass sun uniforms
      this.sky_render = new Render({
         shader: Shader.sky,
         draw: () => { sky_mesh.draw(); },
         cull: gl.BACK,
         fbo: options.fbo ? options.fbo : false,
         result_target: options.result_target,
         uniforms: {
            resolution: [GLWeb.canvas.width, GLWeb.canvas.height],
            ambient: options.ambient_color
         }
      })
   }

   render() {
      this.sky_render.render();
   }
}

module.exports = Sky;
