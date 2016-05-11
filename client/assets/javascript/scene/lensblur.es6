var GLWeb = require('../glweb/main.js');
const Mesh = require('../glweb/mesh.js');
const Render = require('../glweb/render.js');
const Shader = require('../glweb/shader.js');
const Texture = require('../glweb/texture.js');
const Helper = require('../helper.js');
var gl = GLWeb.gl;

class LensBlur {
   constructor(options) {
      this.repeat = options.repeat || 1;
      this.source = options.source;
      this.result = options.result_target.color;

      var blur_mesh = new Mesh({
         buffers: [Helper.full_screen.vertices]
      });

      this.blur_h = new Render({
         shader: Shader.blur,
         draw: () => { blur_mesh.draw(); },
         result_target: {
            color: new Texture()
         },
         clear_options: {
            color: [0,0,0,0]
         },
         depth: false,
         cull: gl.BACK,
         samplers: {
            source: options.source
         },
         uniforms: {
            resolution: [GLWeb.canvas.width, GLWeb.canvas.height],
            axis: [1,0]
         }
      })

      this.blur_v = new Render({
         shader: Shader.blur,
         draw: () => { blur_mesh.draw(); },
         result_target: options.result_target,
         clear_options: {
            color: [0,0,0,0]
         },
         depth: false,
         cull: gl.BACK,
         samplers: {
            source: this.blur_h.result_target.color
            //source: options.source
         },
         uniforms: {
            resolution: [GLWeb.canvas.width, GLWeb.canvas.height],
            axis: [0,1]
         }
      })

   }

   render() {
      this.blur_h.samplers.source = this.source;
      for (let i = 0; i < this.repeat; i++) {
         this.blur_h.render();
         this.blur_h.samplers.source = this.result;
         this.blur_v.render();
      }
   }
}

module.exports = LensBlur;

