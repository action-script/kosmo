var $ = require('../../externals/jquery/dist/jquery.js')

class GLWeb {
   static init(canvas_id) {
      this.canvas = $('canvas#' + canvas_id)[0];
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      try {
         this.getContext(this.canvas);
      }
      catch (error) {
         console.log(error);
         return null;
      }
      return this;
   }

   static getContext(canvas) {
      let gl_context;
      let context_names = ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl'];
      for (let name of context_names) {
         gl_context = canvas.getContext(name);
         if(gl_context != null)
            break;
      }
      if(gl_context != null) {
         this.gl = gl_context;
      }
      else
         throw ('the browser does not support webgl');
   }
}

module.exports = GLWeb;
