var GLWeb = require('./main.js');
var gl = GLWeb.gl;

class RenderBufferImage {
   constructor(type, params = null) {
      var settings = {
         width: GLWeb.canvas.width,
         height: GLWeb.canvas.height
      };
      params = Object.assign(settings, params);

      switch (type) {
         case RenderBufferImage.DEPTH: {
            this.format = gl.DEPTH_COMPONENT16;
            break;
         }
         case RenderBufferImage.STENCIL: {
            this.format = gl.STENCIL_INDEX8;
            break;
         }
         case RenderBufferImage.STENCIL: {
            this.format = gl.DEPTH_STENCIL;
            break;
         }
         default: {
            throw 'Error: not RenderBuffer valid type';
            break;
         }
      }

      this.buffer = gl.createRenderbuffer();

      gl.bindRenderbuffer(gl.RENDERBUFFER, this.buffer);
      gl.renderbufferStorage(
         gl.RENDERBUFFER,
         this.format,
         params.width,
         params.height
      );
      gl.bindRenderbuffer(gl.RENDERBUFFER, null);
   }
}

// const
RenderBufferImage.DEPTH = 0;
RenderBufferImage.STENCIL = 1;
RenderBufferImage.DEPTH_STENCIL = 2;

module.exports = RenderBufferImage;
