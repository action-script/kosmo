var GLWeb = require('./glweb/main.js').init('app');
const Helper = require('./helper.js');
const Loader = require('./loaders/obj.js');
const Mesh = require('./glweb/mesh.js');
const Shader = require('./glweb/shader.js');
const Texture = require('./glweb/texture.js');
const RenderBuffer = require('./glweb/renderbuffer.js');
const Render = require('./glweb/render.js');
const Camera = require('./cameraController.js');
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


var pass_shader = [
'vertex:',
'attribute vec3 vertices;',
'attribute vec2 textures;',
'varying vec2 vtexcoord;',
'void main(void) {',
'  gl_Position = vec4(vertices, 1.0);',
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


var test_shader = new Shader(shader.join('\n'));
var test_pass_shader = new Shader(pass_shader.join('\n'));

var camera = new Camera({
   aspect_ratio: GLWeb.canvas.width / GLWeb.canvas.height,
   position: [0, 0, 5]
});

var color_result = new Texture();
var depth_result = new RenderBuffer(RenderBuffer.DEPTH);

var screen_render = new Render({
   shader: test_pass_shader,
   samplers: {
      source: color_result
   }
});

var objLoad = new Loader('/api/item/test');
objLoad.load( obj => {
   console.log('getting obj', obj);

   var mesh = new Mesh(obj);

   test_scene.init({
      camera: camera,
      shader: test_shader,
      object: mesh,
      result_target: {
         color: color_result,
         depth: depth_result
      }
   });

   GLWeb.mainLoop((time, current) => {
      camera.calculateView();
         
      // color scene render
      test_scene.render();
         
      // on screen fx pass
      screen_render.render();

   }, true);
  
});
