const GLWeb = require('./glweb/main.js');
const Camera = require('./glweb/camera.js');
const $ = require('../externals/jquery/dist/jquery.js');
const glMatrix = require('../externals/gl-matrix/dist/gl-matrix-min.js');
const Helper = require('./helper.js');

class CameraController extends Camera {
   constructor(params) {
      super(params);
      this.rotation_speed = 0.1;
      this.radius = Math.abs( glMatrix.vec3.dist(this.center, this.position) );
      this.rotation_offset = glMatrix.vec3.create();

      this.move_speed = 0.01;

      this.events = {
         'this.el#mousedown': 'click',
         'this.el#mouseup': 'releaseClick',
         'this.el#mousemove': 'rotate',
         'document#keydown': 'type',
         'document#keyup': 'releaseType'
      }

      this.keys = {};

      this.el = GLWeb.canvas;
      this.delegateEvents();
   }

   calculateView() {
      // Rotation
      let x = 0, y = 1, z = 2;
      if (this.rotation_offset[0] != 0 || this.rotation_offset[1] != 0) {
         var centred = glMatrix.vec3.sub([], this.center, this.position);
         var result = glMatrix.vec3.create();
         /*
      X
         x' = x
         y' = y*cos q - z*sin q
         z' = y*sin q + z*cos q

      Y
         x' = z*sin q + x*cos q
         y' = y
         z' = z*cos q - x*sin q
         */
         // rotation X
         var rotation = Math.radians( this.rotation_offset[x] );
         glMatrix.vec3.set(
            result,
            centred[x], // x
            centred[y] * Math.cos(rotation) - centred[z] * Math.sin(rotation),// y
            centred[y] * Math.sin(rotation) + centred[z] * Math.cos(rotation) // z
         );

         centred[0] = result[0];
         centred[1] = result[1];
         centred[2] = result[2];

         // totation Y
         var rotation = Math.radians( this.rotation_offset[y] );
         glMatrix.vec3.set(
            result,
            centred[z] * Math.sin(rotation) + centred[x] * Math.cos(rotation),// x
            centred[y], // y
            centred[z] * Math.cos(rotation) - centred[x] * Math.sin(rotation) // z
         );

         glMatrix.vec3.add(this.center, result, this.position);
         glMatrix.vec3.set(this.rotation_offset, 0, 0, 0);
      }
       
      // movement
      if (this.keys.a || this.keys.d || this.keys.w ||this.keys.s) {
         var centred = glMatrix.vec3.sub([], this.center, this.position);
         var centred_unity = glMatrix.vec3.normalize([], centred);
         var movement_position = centred_unity;
         if (this.keys.s)
            movement_position = glMatrix.vec3.scale([], centred_unity, -1);
         if (this.keys.d)
            movement_position = glMatrix.vec3.cross([],centred_unity,[0,1,0]);
         if (this.keys.a)
            movement_position = glMatrix.vec3.cross([],centred_unity,[0,-1,0]);
         glMatrix.vec3.add(this.position, this.position, movement_position);
         glMatrix.vec3.add(this.center, this.center, movement_position);
      }

      this.projectionMatrix = this.getProjectionMatrix();
      this.viewMatrix = this.getViewMatrix();
   }

   delegateEvents() {
      for (let event in this.events) {
         var [selector, event_triger] = event.split('#');
         $(eval(selector)).on(event_triger, (this[this.events[event]]).bind(this));
      }
      this.mouse_pressed = false;
   }

   // events
   click(event) {
      if (event.button == 0) {
         this.start_x = event.pageX;
         this.start_y = event.pageY;
         this.mouse_pressed = true;
      }
   }

   releaseClick(event) {
      if (event.button == 0)
         this.mouse_pressed = false;
   }

   rotate(event) {
      if (this.mouse_pressed) {
         var x_dif = event.pageX - this.start_x;
         var y_dif = event.pageY - this.start_y;
         this.start_x = event.pageX;
         this.start_y = event.pageY;
         glMatrix.vec3.add(
            this.rotation_offset,
            this.rotation_offset,
            [y_dif * this.rotation_speed, x_dif * this.rotation_speed, 0]
         );
      }
   }

   type(event) {
      this.keys[Helper.keyMap[event.which]] = true;
   }

   releaseType(event) {
      this.keys[Helper.keyMap[event.which]] = false; 
   }
}

module.exports = CameraController;
