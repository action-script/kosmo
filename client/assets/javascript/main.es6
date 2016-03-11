var GLWeb = require('./glweb/main.js').init('app');
var Helper = require('./helper.js');
var Loader = require('./loaders/obj.js');
var Mesh = require('./glweb/mesh.js');
var Shader = require('./glweb/shader.js');
var Texture = require('./glweb/texture.js');
var test_scene = require('./scene/test.js');

/* mock data */
var shader= [
'vertex:',
'attribute vec3 vertices;',
'void main(void) {',
'   gl_Position = vec4(vertices, 1.0);',
'}',
'fragment:',
'void main() {',
'   gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);',
'}'
];

var test_shader = new Shader(shader.join('\n'));

var objLoad = new Loader('/api/item/test');
objLoad.load( obj => {
   console.log('getting obj', obj);

   var mesh = new Mesh(obj);

   test_scene.init({ 
      shader: test_shader,
      object: mesh
   });

   test_scene.render();
}); 
