(() => {
   Math.radians = (degrees) => {
      return degrees * Math.PI / 180
   }
})();

(() => {
if (!window.requestAnimationFrame)
   window.requestAnimationFrame = window.webkitRequestAnimationFrame(window.webkitRequestAnimationFrame ? (window.mozRequestAnimationFrame ? window.requestAnimationFrame = window.mozRequestAnimationFrame : void 0, window.oRequestAnimationFrame ? window.requestAnimationFrame = window.oRequestAnimationFrame : void 0) : void 0);
if (!window.requestAnimationFrame) {
   window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout( () => {
         callback(currTime + timeToCall);
      }, timeToCall );
      lastTime = currTime + timeToCall;
      return id;
   };

   if (!window.cancelAnimationFrame)
      window.cancelAnimationFrame = function(id) {
         clearTimeout(id);
      };
}
})();

exports.createImageFromTexture = function(gl, texture) {
   var width = texture.width;
   var height = texture. height;
   /*
    * code by nkron (http://stackoverflow.com/questions/8191083/can-one-easily-create-an-html-image-element-from-a-webgl-texture-object/18804083#18804083)
   */
   // Create a framebuffer backed by the texture
   var framebuffer = gl.createFramebuffer();
   gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
   gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture.texture, 0);

   // Read the contents of the framebuffer
   var data = new Uint8Array(width * height * 4);
   gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);

   gl.deleteFramebuffer(framebuffer);

   // Create a 2D canvas to store the result 
   var canvas = document.createElement('canvas');
   canvas.width = width;
   canvas.height = height;
   var context = canvas.getContext('2d');

   // Copy the pixels to a 2D canvas
   var imageData = context.createImageData(width, height);
   imageData.data.set(data);
   context.putImageData(imageData, 0, 0);

   var img = new Image();
   img.src = canvas.toDataURL();
   return img;
}
