var GLWeb = require('../glweb/main.js');
const Render = require('../glweb/render.js');
const Shader = require('../glweb/shader.js');
const Mesh = require('../glweb/mesh.js');
const Helper = require('../helper.js');
const Texture = require('../glweb/texture.js');
const RenderBuffer = require('../glweb/renderbuffer.js');
var gl = GLWeb.gl;


class Graph {
   constructor(params) {
      Object.assign(this, params);
   }

   init() { 
      var color_result = new Texture();
      var depth_result = new RenderBuffer(RenderBuffer.DEPTH);

      var sky_mesh = new Mesh({
         buffers: [ Helper.full_screen.vertices]
      });

      this.scene_sky = new Render({
         shader: Shader.sky,
         draw: () => { sky_mesh.draw(); },
         uniforms: {
            resolution: [GLWeb.canvas.width, GLWeb.canvas.height],
            ambient: this.scene.tree.root['ambient-color']
         }
      })

      // TODO: render all processor (normals, difuse)
      this.scene_render = new Render({
         shader: Shader.basic,
         result_target: {
            color: color_result,
            depth: depth_result
         },
         clear_options: {
            color: [0,0,0,0],
            depth: 1.0
         },
         depth: true,
         cull: gl.BACK,
         draw: () => { this.scene.draw(); },
         uniforms: {
            projection: {type: 'mat4', data: this.scene.camera.projectionMatrix},
            view: {type: 'mat4', data: this.scene.camera.viewMatrix},
            ambient: this.scene.tree.root['ambient-color']
         }
      });

      this.screen_render = new Render({
         shader: Shader.screen_pass,
         cull: gl.BACK,
         samplers: {
            source: color_result
         },
         blend: 'alpha',
         clear_options: false
      });
   }

   render() {
      // TODO: sky, scene, fx, pass
      // render sky
      this.scene_sky.render();

      // color scene render
      this.scene_render.render();

      // on screen fx pass
      this.screen_render.render();
   }
}

module.exports = Graph;
