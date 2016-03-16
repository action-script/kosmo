const $ = require('../../externals/jquery/dist/jquery.js');

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

   static mainLoop(callback, stats = false) {
      if (stats) {
         const Stats = require('../../externals/stats.js/build/stats.min.js');
         var stats = new Stats();

         // align top-left
         stats.domElement.style.position = 'absolute';
         stats.domElement.style.left = '0px';
         stats.domElement.style.top = '0px';

         document.body.appendChild( stats.domElement );
      }

      var start_time = new Date();

      var loop_step = function() {
         window.requestAnimationFrame(loop_step);

         var current_time = new Date();
         var passed_time = current_time - start_time;

         if (stats)
            stats.begin();

         callback(passed_time, current_time);

         if (stats)
            stats.end();
      }
      window.requestAnimationFrame(loop_step);      
   }
}

module.exports = GLWeb;
