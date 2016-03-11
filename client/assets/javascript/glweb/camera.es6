require('../../externals/gl-matrix/dist/gl-matrix-min.js');

class Camera {
   constructor(params) {
      var settings = {
         fov: 60,
         aspect_ratio: 1.777,
         near_plane: 0.1,
         far_plane: 150,
         position:[0, 0.2, 0.2],
         center: [0, 0, 0],
         up: [0, 1, 0] // up Y
      };
      Object.assign(this, settings, params);

      this.viewMatrix = mat4.create();
      this.projectionMatrix = mat4.create();
   }

   getProjection() {
      return mat4.prespective(
         this.projectionMatrix,
         Math.radians(this.fov),
         this.aspect_ratio,
         this.near_plane,
         this.far_plane 
      );
   }

   getViewMatrix() {
      return mat4.lookAt(
         this.viewMatrix,
         this.position,
         this.center,
         this.up
      );
   }
}

module.exports = Camera;
