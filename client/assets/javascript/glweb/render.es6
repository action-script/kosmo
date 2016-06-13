var GLWeb = require('./main.js');
const Mesh = require('./mesh.js');
const FBO = require('./fbo.js');
const Helper = require('../helper.js');
var gl = GLWeb.gl;

class Render {
   constructor(params) {
      Object.assign(this, params);

      if (params.result_target) {
         this.fbo = params.fbo ? params.fbo : new FBO();
         this.fbo.attachColor(params.result_target.color);
         if (params.result_target.depth !== undefined)
            this.fbo.attachDepth(params.result_target.depth);
         // depth and stencil
         this.fbo.checkFboSatus();
      }
   }

   render() {
      this.shader.bind();

      if (this.samplers)
         this.passSampler()

      if (this.uniforms)
         this.passUniform();
  
      if(this.result_target)
         gl.viewport(0, 0, this.result_target.color.width, this.result_target.color.height);
      else
         gl.viewport(0, 0, GLWeb.canvas.width, GLWeb.canvas.height);

      if(this.blend)
         switch (this.blend) {
            case 'additive':
               gl.enable(gl.BLEND);
               gl.blendFunc(gl.ONE, gl.ONE);
               break;
            case 'alpha':
               gl.enable(gl.BLEND);
               gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
               break;              
         }
      else
         gl.disable(gl.BLEND);

      if (this.depth)
         gl.enable(gl.DEPTH_TEST);
      else 
         gl.disable(gl.DEPTH_TEST);

      if (this.cull) {
         gl.enable(gl.CULL_FACE);
         gl.cullFace(this.cull);
      }
      else
         gl.disable(gl.CULL_FACE);

      if (this.fbo)
         this.fbo.bind();

      Render.clear(this.clear_options);

      if (this.draw)
         this.draw();
      else
         Mesh.full_screen.draw();
  
      this.shader.unbind();
  
      if (this.fbo)
         this.fbo.unbind();
   }

   passSampler(){
      let i = 0;
      for (let name in this.samplers) {
         this.shader.texture(name, i);
         this.samplers[name].bind(i);
         ++i;
      }
   }

   passUniform() {
      // TODO: split uniform into type. Not type check = faster
      for (let name in this.uniforms) {
         this.shader.uniform(name, this.uniforms[name]);
      }
   }   

   static clear(options = null) {
      var flags;
      if (options == null) {
         gl.clearColor(0,0,0,1);
         gl.clearDepth(1.0);
         //gl.clearStencil(0);
         flags = gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT;
      }
      else {
         if (options == false)
            return
         else {
            if (options.color) {
               flags |= gl.COLOR_BUFFER_BIT;
               gl.clearColor.apply(gl, options.color);
            }
            if(options.depth){
               flags |= gl.DEPTH_BUFFER_BIT;
               gl.clearDepth(options.depth);
            }
            if(options.stencil){
               flags |= gl.STENCIL_BUFFER_BIT;
               gl.clearStencil(options.stencil || 0);
            }
         }
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
