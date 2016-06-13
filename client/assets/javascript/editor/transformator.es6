var GLWeb = require('../glweb/main.js');
const Helper = require('../helper.js');
var gl = GLWeb.gl;

class Transformator {
   constructor(item) {
      this.item = item;
   }

   display() {
      console.log('Selecting', this.item.mesh);
      this.original_color = this.item.color;
      this.item.color = [180,180,180];
   }

   hide() {
      this.item.color = this.original_color;
   }
   
}

module.exports = Transformator;
