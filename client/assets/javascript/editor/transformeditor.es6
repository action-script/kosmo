const GLWeb = require('../glweb/main.js');
const $ = require('../../externals/jquery/dist/jquery.js');
const Helper = require('../helper.js');
const Transformator = require('./transformator.js');
const MouseSelector = require('../physics/mouseselector.js');

class TransformEditor {
   constructor(scene) {
      this.scene = scene;

      this.events = {
         'this.el#click': 'mouseClick'
//         'this.el#mousedown': 'click',
//         'this.el#mouseup': 'releaseClick'
      }

      this.el = GLWeb.canvas;
      Helper.delegateEvents($, this.events, this);

      this.mouseSelector = new MouseSelector(this.scene);
   }

   // TODO: move computed item until release and then update tree and unpack scene or unpack branch;

   // events
   mouseClick(event) {
      if (this.selected_item != undefined && this.selected_item != null)
         this.selected_item.hide();
      var item = this.mouseSelector.getPointingItem();
      if (item != undefined && item != null) {
         this.selected_item = new Transformator(item);
         this.selected_item.display();
      }
   }
  
   
   
}

module.exports = TransformEditor;
