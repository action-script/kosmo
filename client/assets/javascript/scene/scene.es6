const SceneLoader = require('../loaders/scene.js');
const SceneTree = require('./tree.js');
const OBJLoader = require('../loaders/obj.js');
const Mesh = require('../glweb/mesh.js');
const Shader = require('../glweb/shader.js');
const Helper = require('../helper.js');
const $ = require('../../externals/jquery/dist/jquery.js');
const glMatrix = require('../../externals/gl-matrix/dist/gl-matrix-min.js');

class Scene {
   constructor(id) {
      this.sources = {
         meshes: [],
         textures: []
      };
      this.static_meshes = [];

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
      var last_level_item = {0: null}
      while(!done) {
         var {node, depth} = next.value;
         console.log(node.mesh, depth);

         last_level_item[depth] = node;

         if (depth == 0)
            node.transform = glMatrix.mat4.create();
         else
            node.transform = glMatrix.mat4.copy([], last_level_item[depth-1].transform);
         if (node.translate && node.translate.length > 0)
            glMatrix.mat4.translate(node.transform, node.transform, node.translate);

         if (node.rotate && node.rotate.length > 0) {
            if(node.rotate[0] != 0)
               glMatrix.mat4.rotateX(node.transform, node.transform, Math.radians(node.rotate[0]));
            if(node.rotate[1] != 0)
               glMatrix.mat4.rotateY(node.transform, node.transform, Math.radians(node.rotate[1]));
            if(node.rotate[2] != 0)
               glMatrix.mat4.rotateZ(node.transform, node.transform, Math.radians(node.rotate[2]));
         }

         if (node.scale && node.scale.length > 0)
            glMatrix.mat4.scale(node.transform, node.transform, node.scale);


         if (node.color == undefined || node.color.length == 0)
            node.color = [0, 0, 0]


         this.static_meshes.push(node);

         if ($.inArray( node.mesh,  this.sources.meshes) < 0)
            this.sources.meshes.push(node.mesh);

         next = gen.next();
         done = next.done;
      }
   }

   draw() {
      for (let mesh of this.static_meshes) {
         Shader.current.uniform( 'model', {type: 'mat4', data: mesh.transform} );
         Shader.current.uniform( 'color', mesh.color );
         this.sources.meshes[mesh.mesh].draw();
      }
   }

   drawPositions() {
      for (let [i, mesh] of this.static_meshes.entries()) {
         Shader.current.uniform( 'model', {type: 'mat4', data: mesh.transform} );
         Shader.current.uniform( 'color', Helper.ColorTool.toRGB(i+1) );
         this.sources.meshes[mesh.mesh].drawPosition();
      }
   }

   destroy() {
      // TODO: IMPORTANT destroy all gl objects and clean memory
   }
}

module.exports = Scene;
