var VBO = require('./vbo.js');

class Mesh {
   constructor(mesh) {
      this.vbo = new VBO();

      if (typeof mesh == 'string')
         mesh = Mesh.jsonParse(mesh);

      for ( let buffer of mesh.buffers )
         this.vbo.initBuffer(buffer);

      if (mesh.indices != undefined && mesh.indices.length > 0)
         this.vbo.initIndexBuffer(mesh.indices);

      this.id = mesh.id;
   }

   remove() {
      this.vbo.destroy();
   }

   draw() {
      this.vbo.bind();
      this.vbo.draw();
      this.vbo.unbind();
   }

   drawPosition() {
      this.vbo.bind([this.vbo.buffers[0]]);
      this.vbo.draw();
      this.vbo.unbind();
   }

   static jsonParse(mesh_string) {
      var result = { buffers: [] };
      var mesh = JSON.parse(mesh_string);

      for (var name in mesh.buffers) {
         var buffer = {
            name: name,
            data: mesh.buffers[name],
            attrib_size: name == 'textures' ? 2 : 3
         };

         if (buffer.data.length > 0)
            result.buffers.push(buffer);
      }

      if (mesh.indices != undefined && mesh.indices.length > 0)
         result.indices = mesh.indices;

      result.id = mesh['_id'];

      return result;
   }

}

module.exports = Mesh;
