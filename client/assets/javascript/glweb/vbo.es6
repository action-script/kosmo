var GLWeb = require('./main.js');
var gl = GLWeb.gl;

class VBO {
   // buffer: name, attrib_size, data
   constructor() {
      this.buffers = [];
      this.isElementMesh = false;
   }

   // remove buffers from memory on graphic card
   destroy() {
      for (let {vbo} of buffers)
         if (gl.isBuffer(vbo))
            gl.deleteBuffer(vbo);
   }

   // load individual buffers
   initBuffer(bufferData) {
      this.buffers.push(bufferData);
      let buffer = this.buffers.slice(-1)[0];

      buffer.vbo = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer.vbo);
      gl.bufferData(
         gl.ARRAY_BUFFER,                 // target
         new Float32Array(buffer.data),   // data
         gl.STATIC_DRAW                   // usage
      );
      gl.bindBuffer(gl.ARRAY_BUFFER, null); // clean up
   }

   // load array of elements
   initIndexBuffer(indices) {
      this.isElementMesh = true;
      this.indicesSize = indices.length;
      this.ibo = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
      gl.bindBuffer(
         gl.ELEMENT_ARRAY_BUFFER,
         new Uint16Array(indices),
         gl.STATIC_DRAW
      );
      gl.bindBuffer(gl.ARRAY_BUFFER, null); // clean up
   }

   // bind buffer
   setUpAttribPointer() {
      var attrib_location = GLWeb.Shader.current.getAttribLocation(buffer.name);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer,vbo);
      gl.enableVertexAttribArray(attrib_location);
      gl.vertexAttribPointer(
         attrib_location,     // shader attribute pointer
         buffer.attrib_size,  // size, number of elements
         gl.FLOAT,            // type of elements
         false,               // normalized
         0,                   // stride, data between each position
         0                    // pointer, ffset of first element
      );
   }

   bind() {
      for (let buffer of this.buffers) {
         this.setUpAttribPointer(buffer);
      }
      if (this.isElementMesh)
         gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
   }

   unbind() {
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      if (this.isElementMesh)
         gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
   }
  
   draw(mode = gl.TRIANGLES, count) {
      if (this.isElementMesh)
         gl.drawElements(type, this.indicesSize, gl.UNSIGNED_SHORT, 0)
      else
         gl.drawArrays(mode, 0, count);
   }
}

module.exports = VBO;
