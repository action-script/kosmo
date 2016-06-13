var GLWeb = require('../glweb/main.js');
const Render = require('../glweb/render.js');
const Mesh = require('../glweb/mesh.js');
const Helper = require('../helper.js');
const Shader = require('../glweb/shader.js');
const Camera = require('../glweb/camera.js');
const glMatrix = require('../../externals/gl-matrix/dist/gl-matrix-min.js');
var gl = GLWeb.gl;

class Pointer {
   constructor() {
      var quad = new Mesh({
         buffers: [Helper.full_screen.vertices]
      });
      var cam = new Camera({
         aspect_ratio: GLWeb.canvas.width / GLWeb.canvas.height,
         far_plane: 2,
         position:[0, 0, 1]
      });

      cam.getProjectionMatrix();
      cam.getViewMatrix();

      var transform = glMatrix.mat4.create();
      glMatrix.mat4.scale(transform, transform, [0.005, 0.005, 0.005]);

      this.process = new Render({
         shader: Shader.basiccolor,
         clear_options: false,
         draw: () => {
            quad.draw();
         },
         cull: gl.BACK,
         uniforms: {
            projection: {type: 'mat4', data: cam.projectionMatrix},
            view: {type: 'mat4', data: cam.viewMatrix},
            model: {type: 'mat4', data: transform},
            color: [255,255,255]
         }
      });
   }

   display() {
      this.process.render();
   }
}

module.exports = Pointer;
