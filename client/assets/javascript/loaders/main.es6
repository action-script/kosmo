class LoadManager {
   constructor() {
      this.percentage = 0;
      this.loaders = [];
   }

   addLoad(load) {
      load.percentage = 0;
      load.request.addEventListener('progress', event => {
         if ( event.lengthComputable ) {
            load.percentage = event.loaded / event.total * 100;
         }
      }, false );
      this.loaders.push(load);
   }

   getLoadPercent() {
      var total = 0;
      for (let load of this.loaders) {
         total += load.percentage;
      }

      if (this.loaders.length != 0) {
         total /= this.loaders.length;
         if (total == 100)
            this.loaders = [];
         return total;
      }
      else
         return 100;
   }
}

module.exports = new LoadManager();
