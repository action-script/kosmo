var GLWeb = require('./glweb/main.js').init('app');
var Mesh = require('./glweb/mesh.js');

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
new Mesh(mesh);

