var VBO = require('./vbo.js');

class Mesh {
   constructor(mesh) {
      this.vbo = new VBO();
      for ( let buffer of mesh.buffers )
         this.vbo.initBuffer(buffer);
   }

   remove() {
      this.vbo.destroy();
   }

   draw() {
      this.vbo.bind();
      this.vbo.draw(mesh.count);
      this.vbo.unbind();
   }
}

module.exports = Mesh;
