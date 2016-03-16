var GLWeb = require('./main.js');
var gl = GLWeb.gl;

class Shader {
   constructor(source) {
      this.uniform_locations = {};
      this.attrib_locations = {};
      var shaders = processSources(source);
      this.create(shaders);
   }

   destroy() {
      let {vertex, fragment} = gl.getAttachedShaders(this.program);
      gl.deatachShader(this.program, vertex);
      gl.deatachShader(this.program, fragment);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      gl.deleteProgram(this.program);
   }

   create(shaders) {
      // create program and shaders
      this.program = gl.createProgram();
      this.vertex = gl.createShader(gl.VERTEX_SHADER);
      this.fragment = gl.createShader(gl.FRAGMENT_SHADER);

      // load sources and compile
      this.compile( this.vertex, shaders.vertex );
      this.compile( this.fragment, shaders.fragment );

      // attach shaders to program
      gl.attachShader( this.program, this.vertex );
      gl.attachShader( this.program, this.fragment );

      // link program
      gl.linkProgram( this.program );

      this.checkShaderError(this.program); 
   }

   compile(shader, source) {
      var directives = [
         '#ifdef GL_FRAGMENT_PRECISION_HIGH',
         'precision highp int;',
         'precision highp float;',
         '#else',
         'precision mediump int;',
         'precision mediump float;',
         '#endif'
      ];

      gl.shaderSource(shader, directives.join('\n') + '\n' + source);

      // compile sahder
      gl.compileShader(shader);

      // check compile errors
      this.checkShaderError(shader);
   }

   checkShaderError(object) {
      var is_program;

      try {
         is_program = gl.isProgram(object);
      }
      catch (e) {
         try {
            is_program = !gl.isShader(object);
         }
         catch (e) {
            if (is_program == undefined)
               throw ('not shader or program')
         }
      }

      var success;
      if (is_program) {
         success = gl.getProgramParameter(object, gl.LINK_STATUS);
         if (!success)
            throw (`Linking program error ${gl.getProgramInfoLog(object)}`);
      }
      else {
         success = gl.getShaderParameter(object, gl.COMPILE_STATUS);
         if (!success)
            throw (`Could not compile shader\n${gl.getShaderInfoLog(object)}`);
      }
   }

   getAttribLocation(name) {
      var attrib_location = this.attrib_locations[name];
      if (attrib_location === undefined)
         var attrib_location = this.attrib_locations[name] = gl.getAttribLocation(this.program, name);
      return attrib_location;
   }

   getUniformLocation(name) {
      var uniform_location = this.uniform_locations[name];
      if (uniform_location === undefined)
         var uniform_location = this.uniform_locations[name] = gl.getUniformLocation(this.program, name);
      return uniform_location;
   }

   uniform(name, value) {
      var uniform_location = this.getUniformLocation(name);
      if (value.type == 'mat4') {
         gl.uniformMatrix4fv(uniform_location, false, value.data);
      }
      else if (value.type == 'mat3') {
         gl.uniformMatrix3fv(uniform_location, false, value.data);
      }
      else if (typeof(value) == 'number') {
         if (isInt(value))
            gl.uniform1i(uniform_location, value);
         else if (isFloat(value))
            gl.uniform1f(uniform_location, value);
      }
      else if (typeof(value) == 'object') {
         gl[`uniform${value.length}fv`](uniform_location, value);
      }
   }

   texture(name, id = 0) {
      var uniform_location = this.getUniformLocation(name);
      if (uniform_location)
         gl.uniform1i(uniform_location, id);
   }

   unbind() {
      Shader.current = null;
      gl.useProgram(null);
   }

   bind() {
      Shader.current = this;
      gl.useProgram(this.program);
   }
}

function processSources(source) {
   var lines = source.split('\n');
   var shaders = {};
   var current = '';

   for (let line of lines) {
      var type = line.match(/^(\w+):/);
      if (type){
         current = type[1];
         shaders[current] = '';
      }
      else if (current)
         shaders[current] += line + '\n';
   }

  return shaders;
}

module.exports = Shader;
