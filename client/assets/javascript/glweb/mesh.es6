var VBO = require('./vbo.js');

class Mesh {
   constructor(mesh) {
      this.vbo = new VBO();
      for ( let buffer of mesh.buffers )
         this.vbo.initBuffer(buffer);
      if (mesh.indices != undefined && mesh.indices.length > 0)
         this.vbo.initIndexBuffer(mesh.indices);
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
