class SceneTree {
   constructor(json_tree = null) {
      if (json_tree)
         this.toSceneTree(json_tree);
   }

   toJson() {
   }

   toSceneTree(json_tree) {
      var scene_obj = JSON.parse(json_tree);
      this.id = scene_obj['_id'];
      this.root = scene_obj[SceneTree.TREE_NAME][SceneTree.ROOT_NAME];
      this.nodes = scene_obj[SceneTree.TREE_NAME][SceneTree.WORLD_NAME][0];
   }

   iterate(root = this.nodes) {
      return (function* iterate(current, depth) {
         if (current.mesh !== undefined) {
            yield {node: current, depth: depth};
            ++depth;
         }
         var nodes = current[SceneTree.NODES_NAME];
         if (nodes !== undefined)
            for (var i = 0, len = nodes.length; i < len; i++) {
               yield* iterate(nodes[i], depth);
            }
      })(root,0);
   }

   add(params) {
      var node = {
         rotate: null,
         translate: null,
         scale: null,
         mesh: null,
         nodes: []
      }
      var params = Object.assign(node, params);

      if (this.root === null)
         this.root = node;

      return node;
   }
}

// const
SceneTree.TREE_NAME = 'scene';
SceneTree.ROOT_NAME = 'root';
SceneTree.WORLD_NAME = 'world';
SceneTree.NODES_NAME = 'nodes';
SceneTree.AMBIANCE_NAME = 'ambiance';

module.exports = SceneTree;
