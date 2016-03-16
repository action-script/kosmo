var GLWeb = require('./main.js');
var gl = GLWeb.gl;

class FBO {
   constructor() {
      this.fbo = gl.createFramebuffer();
   }

   checkFboSatus() {
      if (!gl.isFramebuffer(this.fbo)) {
         throw 'Error. fbo is not frame';
         return;
      }

      this.bind();
      switch (gl.checkFramebufferStatus(gl.FRAMEBUFFER)) {
         case gl.FRAMEBUFFER_COMPLETE:
            //console.log('framebuffer complete');
            break;
         case gl.FRAMEBUFFER_UNSUPPORTED:
            throw 'Error: video card does NOT support framebuffer object';
            break;
         case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
            throw 'Error: framebuffer incomplete attachment';
            break;
         case gl.FRAMEBUFFER_INCOMPLETE_DIMESIONS:
            throw 'Error: framebuffer incomplete dimensions';
            break;
         case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
            throw 'Error: framebuffer incomplete missing attachment';
            break;
         default:
            throw 'Error: not a valuated error';
      }
      this.unbind();
   }

   bind() {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
   }

   unbind() {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
   }

   attachColor(texture) {
      this.bind();
      gl.framebufferTexture2D(
         gl.FRAMEBUFFER,         // target
         gl.COLOR_ATTACHMENT0,   // attachment pointer
         texture.target,         // texture target
         texture.texture,        // texture id
         0                       // mipmap level of the texture to be attached
      );
      this.unbind();
   }

   attachDepth(buffer = null) {
      this.bind();
      gl.framebufferRenderbuffer(
         gl.FRAMEBUFFER,               // target
         gl.DEPTH_ATTACHMENT,          // attachment pointer
         gl.RENDERBUFFER,              // renderbuffer target
         buffer.buffer ? buffer.buffer : null  // renderbuffer id
      );
      this.unbind();
   }
}

module.exports = FBO;
