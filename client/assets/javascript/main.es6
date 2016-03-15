var GLWeb = require('./glweb/main.js').init('app');
var Helper = require('./helper.js');
var Loader = require('./loaders/obj.js');
var Mesh = require('./glweb/mesh.js');
var Shader = require('./glweb/shader.js');
var Texture = require('./glweb/texture.js');
var Camera = require('./glweb/camera.js');
var test_scene = require('./scene/test.js');

/* mock data */
var shader= [
'vertex:',
'attribute vec3 vertices;',
'uniform mat4 projection, view;',
'void main(void) {',
'  gl_Position = projection * view * vec4(vertices, 1.0);',
'}',
'fragment:',
'uniform vec3 color;',
'void main() {',
'  gl_FragColor = vec4(color, 1.0);',
'}'
];

/*
var pass_shader = [
'vertex:',
'attribute vec3 vertices;',
'attribute vec2 textures;',
'varying vec2 vtexcoord;',
'void main(void) {',
'  gl_Position = vec4(vertices, 1.0);,
'  vtexcoord = textures;',
'}',
'fragment:',
'varying vec2 vtexcoord;',
'uniform sampler2D source;',
'void main(void) {',
'  vec4 src = texture2D(source, vtexcoord);',
'  gl_FragColor = vec4(src.rgb, 1.0);',
'}'
];
*/

var test_shader = new Shader(shader.join('\n'));
//var test_pass_shader = new Shader(pass_shader.join('\n'));

var camera = new Camera({
   aspect_ratio: GLWeb.canvas.width / GLWeb.canvas.height,
   position: [0, 0.5, 2]
});

var objLoad = new Loader('/api/item/test');
objLoad.load( obj => {
   console.log('getting obj', obj);

   var mesh = new Mesh(obj);

   test_scene.init({
      camera: camera,
      shader: test_shader,
      object: mesh
   });

   test_scene.render();
}); 
