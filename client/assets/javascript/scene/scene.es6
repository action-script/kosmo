const SceneLoader = require('../loaders/scene.js');
const SceneTree = require('./tree.js');
const OBJLoader = require('../loaders/obj.js');
const Mesh = require('../glweb/mesh.js');
const $ = require('../../externals/jquery/dist/jquery.js');

class Scene {
   constructor(id) {
      this.sources = {
         meshes: [],
         shaders: [],
         textures: []
      };

      this.id = id;
   }
   
   loadScene(callback) {
      new SceneLoader(this.id).load( response_json => {
         this.tree = new SceneTree(response_json);
         this.unpackScene();

         var deferreds = $.map(this.sources.meshes, (id) => {
            return new OBJLoader(id).loadPromise();
         });

         var self = this;
         $.when.apply($, deferreds).then( function(obj) {
            console.log('All downloaded');
            //console.log(arguments);
            Array.from( arguments, (mesh_source) => {
               var mesh = new Mesh(mesh_source);
               self.sources.meshes[mesh.id] = mesh;
            });
            callback();
         });
      });
   }

   // TODO: preprocess all object matrices on the tree
   unpackScene() {
      var gen = this.tree.iterate();
      var next = gen.next();
      var done = next.done;
//      var last_level_item = {0: null}
      while(!done) {
         var {node, depth} = next.value;
//         last_level_item[depth] = node;
         console.log(node.mesh, depth);
         if ($.inArray( node.mesh,  this.sources.meshes) < 0)
            this.sources.meshes.push(node.mesh);

         next = gen.next();
         done = next.done;
      }
   }

}

module.exports = Scene;
