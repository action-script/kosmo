var GLWeb = require('../glweb/main.js');
const Shader = require('../glweb/shader.js');
const Render = require('../glweb/render.js');
const Texture = require('../glweb/texture.js');
const RenderBuffer = require('../glweb/renderbuffer.js');
const Helper = require('../helper.js');
var gl = GLWeb.gl;

class MouseSelector {
   constructor(scene) {
      this.scene = scene;

      var precision = 100;
      var color_result = new Texture({width: precision, height: precision});
      var depth_buffer = new RenderBuffer(RenderBuffer.DEPTH, {width: 100, height: 100});  

      this.process = new Render({
         shader: Shader.basiccolor,
         result_target: {
            color: color_result,
            depth: depth_buffer
         },
         depth: true,
         cull: gl.BACK,
         draw: () => {
            this.scene.drawPositions();
            this.pixels = new Uint8Array(1 * 4);
            gl.readPixels(
               precision/2,
               precision/2,
               1,
               1,
               gl.RGBA,
               gl.UNSIGNED_BYTE,
               this.pixels
            );
         },
         uniforms: {
            projection: {type: 'mat4', data: this.scene.camera.projectionMatrix},
            view: {type: 'mat4', data: this.scene.camera.viewMatrix}
         }
      });
   }

   getPointingItem() {
      this.renderItemsIntexture();
      let id = Helper.ColorTool.toDecimal(this.pixels);
      console.log('pixel', this.pixels );
      console.log('id: ' + id );
//      var result_texture = this.process.result_target.color;
//      var result_image = Helper.createImageFromTexture(gl, result_texture);
      let mesh = null
      if (id > 0)
         mesh = this.scene.static_meshes[id-1];
      return mesh;
   }

   renderItemsIntexture() {
      this.process.render();
   }
}

module.exports = MouseSelector;
