var GLWeb = require('./glweb/main.js').init('app');
var Mesh = require('./glweb/mesh.js');
var Shader = require('./glweb/shader.js');
var Loader = require('./loaders/obj.js');
/* mock data */
var mesh = {
   buffers: [
      {
         name: 'vertex',
         attrib_size: 3,
         data: [0,0,0 ,1,0,0, 1,1,1]
      }
   ]
};
var shader= [
'vertex:',
'attribute vec3 vposition;',
'void main(void) {',
'   gl_Position = vec4(vposition, 1.0);',
'}',
'fragment:',
'void main() {',
'   gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);',
'}'
];

new Shader(shader.join('\n'));
new Mesh(mesh);

var objLoad = new Loader('/api/item/test');
objLoad.load( obj => {
   console.log('getting obj', obj);
}); 
