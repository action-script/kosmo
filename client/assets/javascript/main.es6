var GLWeb = require('./glweb/main.js').init('app');
const $ = require('../externals/jquery/dist/jquery.js');
const Helper = require('./helper.js');
const Shader = require('./glweb/shader.js');
const Camera = require('./cameraController.js');
const SceneManager = require('./scene/main.js');

/* mock data */
var shader= [
'vertex:',
'attribute vec3 vertices;',
'uniform mat4 projection, view;',
'varying vec4 pos;',
'void main(void) {',
'  pos = projection * view * vec4(vertices, 1.0);',
'  gl_Position = projection * view * vec4(vertices, 1.0);',
'}',
'fragment:',
'uniform vec3 color;',
'varying vec4 pos;',
'void main() {',
'  vec3 pixel = color.xyz / pos.z/2.;',
'  gl_FragColor = vec4(pixel, 1.0);',
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


Shader.basic = new Shader(shader.join('\n'));
Shader.screen_pass = new Shader(pass_shader.join('\n'));

var camera = new Camera({
   aspect_ratio: GLWeb.canvas.width / GLWeb.canvas.height,
   position: [0, 0, 5]
});

// Scene manager
var scene = new SceneManager(camera);
scene.createScene('test');

GLWeb.mainLoop((time, current) => {
   camera.calculateView();
      
   scene.render(time, current);
}, true);

