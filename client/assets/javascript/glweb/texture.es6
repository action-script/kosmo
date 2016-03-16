var GLWeb = require('./main.js');
var gl = GLWeb.gl;

class Texture2D {
   constructor(params) {
      var settings = {
         channels: 'rgba',
         type: 'unsigned_byte',
         filter: 'linear',
         clamp: 'edge',
         width: GLWeb.canvas.width,
         height: GLWeb.canvas.height
      };
      var params = Object.assign(settings, params);

      this.target = gl.TEXTURE_2D;
      this.texture = gl.createTexture();
      this.channels = gl[(params.channels).toUpperCase()];
      this.type = gl[(params.type).toUpperCase()];
        
      if (params.data != undefined)
         this.data(params.data);
      else
         this.size(params.width, params.height);

      var filter = params.filter;
      if (typeof filter == 'string')
         this[filter]();
      else {
         minify = gl[filter.minify.toUpperCase()] != null ? gl[filter.minify.toUpperCase()] : gl.LINEAR;
         magnify = gl[filter.magnify.toUpperCase()] != null ? gl[filter.magnify.toUpperCase()] : gl.LINEAR;
         gl.texParameteri(this.target, gl.TEXTURE_MAG_FILTER, magnify);
         gl.texParameteri(this.target, gl.TEXTURE_MIN_FILTER, minify);

         if (minify === gl.NEAREST_MIPMAP_NEAREST || minify === gl.LINEAR_MIPMAP_NEAREST || minify === gl.NEAREST_MIPMAP_LINEAR || minify === gl.LINEAR_MIPMAP_LINEAR)
            this.generateMipmap();
         if (filter.anisotropy)
            this.anisotropy();
      }
      this[params.clamp]();

      if (params.anisotropy)
         this.anisotropy();
   }

   destroy() {
      gl.deleteTexture(this.texture);
   }

   generateMipmap() {
      this.mipmapped = true;
      this.bind();
      gl.generateMipmap(this.target);
   }

   anisotropy() {
      this.anisotropic = true;
      var ext;
      var extensions = [
         'EXT_texture_filter_anisotropic',
         'WEBKIT_EXT_texture_filter_anisotropic',
         'MOZ_EXT_texture_filter_anisotropic',
         'O_EXT_texture_filter_anisotropic',
         'MS_EXT_texture_filter_anisotropic'
      ];
      for (let i = 0; i < extensions.length && ext == null; i++) {
         ext = gl.getExtension(extensions[i]);
      }
      if (ext !== null) {
         max = gl.getParameter( ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
         gl.texParameterf(this.target, ext.TEXTURE_MAX_ANISOTROPY_EXT, max);
      }
   }
        
   data(data) {
      this.bind();

      this.width = data.width;
      this.height = data.height;
      gl.texImage2D(this.target, 0, this.channels, this.channels, this.type, data);
      return this;
   }

   flip() {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
   }

   size(width, height) {
      this.width = width;
      this.height = height;
      this.bind();
      gl.texImage2D(this.target, 0, this.channels, this.width, this.height, 0, this.channels, this.type, null);
      return this;
   }
    
   linear() {
      this.bind();

      gl.texParameteri(this.target, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(this.target, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      return this;
   }
    
   nearest() {
      this.bind();

      gl.texParameteri(this.target, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(this.target, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      return this;
   }
    
   repeat() {
      this.bind();

      gl.texParameteri(this.target, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(this.target, gl.TEXTURE_WRAP_T, gl.REPEAT);
      return this;
   }
    
   edge() {
      this.bind();

      gl.texParameteri(this.target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(this.target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return this;
   }
    
   bind(id=0) {
      gl.activeTexture(gl.TEXTURE0 + id);
      gl.bindTexture(this.target, this.texture);
      return this;
   }
}

module.exports = Texture2D;
