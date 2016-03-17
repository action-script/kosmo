var GLWeb = require('./main.js');
var Mesh = require('./mesh.js');
var Shader = require('./shader.js');
var FBO = require('./fbo.js');
var gl = GLWeb.gl;

var full_screen = new Mesh({
   buffers: [
      {
         name: 'vertices',
         attrib_size: 3, 
         data: [
         1, 1, 0,    -1,  1, 0,   -1, -1, 0,
         1, 1, 0,    -1, -1, 0,    1, -1, 0
         ]
      },
      {
         name: 'textures',
         attrib_size: 2,
         data: [
         1, 1,    0, 1,    0, 0,
         1, 1,    0, 0,    1, 0
         ]
      }
   ]
});

class Render {
   constructor(params) {
      Object.assign(this, params);

      if (params.result_target) {
         this.fbo = params.fbo ? params.fbo : new FBO();
         this.fbo.attachColor(params.result_target.color);
         if (params.result_target.depth);
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

      if (this.depth)
         gl.enable(gl.DEPTH_TEST);
      else 
         gl.disable(gl.DEPTH_TEST);

      if (this.fbo)
         this.fbo.bind();

      Render.clear(this.clear_options);

      if (this.draw)
         this.draw();
      else
         full_screen.draw();
  
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
