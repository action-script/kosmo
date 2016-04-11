var GLWeb = require('./glweb/main.js').init('app');
const $ = require('../externals/jquery/dist/jquery.js');
const Helper = require('./helper.js');
const Shader = require('./glweb/shader.js');
const Mesh = require('./glweb/mesh.js');
const Camera = require('./cameraController.js');
const SceneManager = require('./scene/main.js');
var shaders = require('./shaders.js');

// constant shaders
Shader.basic = new Shader(shaders.basic_shader);
Shader.screen_pass = new Shader(shaders.pass_shader);
Shader.sky = new Shader(shaders.sky_shader);

// constant meshes
Mesh.full_screen = new Mesh({
   buffers: [ Helper.full_screen.vertices, Helper.full_screen.textures]
});

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

