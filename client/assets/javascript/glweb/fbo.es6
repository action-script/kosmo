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
            throw 'FBO Error: video card does NOT support framebuffer object';
            break;
         case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
            throw 'FBO Error: framebuffer incomplete attachment';
            break;
         case gl.FRAMEBUFFER_INCOMPLETE_DIMESIONS:
            throw 'FBO Error: framebuffer incomplete dimensions';
            break;
         case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
            throw 'FBO Error: framebuffer incomplete missing attachment';
            break;
         default:
            throw 'FBO Error: not a valuated error';
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
      if (buffer.texture != undefined)
         this.attachDepthTexture(buffer);
      else
         this.attachDepthRenderBuffer(buffer);
   }

   attachDepthTexture(texture) {
      this.bind();
      gl.framebufferTexture2D(
         gl.FRAMEBUFFER,         // target
         gl.DEPTH_ATTACHMENT,    // attachment pointer
         texture.target,         // texture target
         texture.texture,        // texture id
         0                       // mipmap level of the texture to be attached
      );
      this.unbind();
   }

   attachDepthRenderBuffer(buffer) {
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
