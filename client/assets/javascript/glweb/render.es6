var GLWeb = require('./main.js');
var Shader = require('./shader.js');
var FBO = require('./fbo.js');
var gl = GLWeb.gl;

class Render {
   constructor(params) {
      Object.assign(this, params);

      if (params.result_target) {
         this.fbo = new FBO();
         // depth & stencil;         
      }
   }

   render() {
      this.shader.bind();
  
      if(this.result_target)
         gl.viewport(0, 0, this.result_target.width, this.result_target.height);
      else
         gl.viewport(0, 0, GLWeb.canvas.width, GLWeb.canvas.height);
      
      if (this.fbo)
         this.fbo.use();

      Render.clear(this.clear_options);

      this.draw();
  
      this.shader.unbind();
  
      if (this.fbo)
         this.fbo.stop();
   }

   static clear(options = null) {
      var flags;
      if (options == null) {
         gl.clearColor(0,0,0,1);
         gl.clearDepth(0);
         gl.clearStencil(0);
         flags = gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT;
      }
      else {
         if (options.color) {
            flags |= gl.COLOR_BUFFER_BIT;
            gl.clearColor.apply(gl, params.color);
         }
         // params depth and stencil
      }
      gl.clear(flags);
   }

   static enable(name) {
      gl.enable(gl[name]);
   }

   static disable(name) {
      gl.disable(gl[name]);
   }
}

module.exports = Render;
