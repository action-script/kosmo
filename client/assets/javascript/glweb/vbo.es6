class VBO {
   constructor(gl) {
      this.gl = gl;
      this.buffers = [];
   }

   destroy() {
      for (let {vbo} of buffers)
         if (this.gl.isBuffer(vbo))
            this.gl.deleteBuffer(vbo);
   }

   // load individual buffers
   initBuffer(bufferData) {
      let gl = this.gl;
      let buffer = this.buffers[id] = bufferData;

      buffer.vbo = gl.createBuffer()
      this.bind(buffer.vbo);
      gl.bufferData(
         gl.ARRAY_BUFFER,                 // target
         new Float32Array(buffer.data),   // data
         gl.STATIC_DRAW                   // usage
      );
      this.bind(null); // clean up
   }

   // bind or unbind
   bind(vbo = null) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
   }
   
   setUpAttribPointer(buffer_id){
      let gl = this.gl;
      let {attr_pointer_id, attr_pointer_size} = this.buffers[buffer_id];

      gl.enableVertexAttribArray(attr_pointer_id);
      gl.vertexAttribPointer(
         attr_pointer_id,     // shader attribute pointer
         attr_pointer_size,   // size, number of elements
         gl.FLOAT             // type of elements
         false,               // normalized
         0,                   // stride, data between each position
         0                    // pointer, ffset of first element
      );
   }

   draw(type = this.gl.TRIANGLES) {
      for (let {id,vbo} of buffers) {
         this.bind(vbo);
         this.setUpAttribPointer(id);
      }

      this.gl.drawArrays(
         type,
         0,
         this.buffers[0].data.length/this.buffers[0].attr_pointer_size
      );

      this.bind(null);      
   }
}

module.exports = VBO;
