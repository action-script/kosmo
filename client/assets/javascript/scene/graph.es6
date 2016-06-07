var GLWeb = require('../glweb/main.js');
const Sky = require('./sky.js');
const Sun = require('../lights/sun');
const Blur = require('./lensblur.js');
const Render = require('../glweb/render.js');
const Shader = require('../glweb/shader.js');
const Texture = require('../glweb/texture.js');
const RenderBuffer = require('../glweb/renderbuffer.js');
const Helper = require('../helper.js');
var gl = GLWeb.gl;

class Graph {
   constructor(params) {
      Object.assign(this, params);
   }

   init() {
      // important. enable depth texture extension
      var depthTextureExt = gl.getExtension('WEBKIT_WEBGL_depth_texture');

      var scene_result = new Texture();
      var color_result = new Texture();
      var blur_result = new Texture();  // TODO: scale blur size for optimization
      var ca_result = new Texture();

      var depth_result = new Texture({
         channels: 'DEPTH_COMPONENT',
         type: 'UNSIGNED_SHORT'
      });
      var depth_buffer = new RenderBuffer(RenderBuffer.DEPTH);

      //if (options.sun)
      this.sun = new Sun(); 

      this.sky = new Sky({
         ambient_color: this.scene.tree.root['ambient-color'],
         sun: this.sun,
         result_target: {
            color: scene_result
         }
      });

      // TODO: render all processor (normals, difuse)
      this.scene_render = new Render({
         shader: Shader.light,
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
            ambient: this.scene.tree.root['ambient-color'],
            'sunlight.color': this.sun.color,
            'sunlight.direction': this.sun.direction,
            'sunlight.ambientintensity': this.sun.ambient_intensity
         }
      });

      this.blur = new Blur({
         repeat: 2,
         result_target: {
            color: blur_result
         },
         source: scene_result
      });

      this.chromaticaberration = new Render({
         shader: Shader.chromaticaberration,
         cull: gl.BACK,
         result_target: {
            color: ca_result
         },
         samplers: {
            source: scene_result,
            depth: depth_result
         }
      });

      this.combine =  new Render({
         shader: Shader.screen_pass,
         cull: gl.BACK,
         result_target: {
            color: scene_result
         },
         samplers: {
            source: color_result
         },
         blend: 'alpha',
         clear_options: false
      });

      this.screen_render = new Render({
         shader: Shader.screen_pass,
         cull: gl.BACK,
         samplers: {
            source: ca_result
            //source: color_result
            //source: depth_result
         },
         blend: 'alpha',
         clear_options: false
      });
   }

   render() {
      // TODO: sky, scene, fx, pass
      // render sky
      this.sky.render();

      // color scene render
      this.scene_render.render();

      // combine sky and scene
      this.combine.render();

      // on screen fx pass
      //this.blur.render();
      this.chromaticaberration.render();
      this.screen_render.render();
   }
}

module.exports = Graph;
