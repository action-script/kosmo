class LoadManager {
   constructor() {
      this.percentage = 0;
      this.loaders = [];
   }

   addLoad(load) {
      load.percent = 0;
      load.request.addEventListener('progress', event => {
         if ( event.lengthComputable ) {
            load.percentage = event.loaded / event.total * 100;
         }
      }, false );
      this.loaders.push(request);
   }

   getLoadPercent() {
      var total = 0;
      for (let load in this.loaders) {
         total += load.percentage;
      }

      total /= this.loaders.length();
      if (total == 100)
         this.loaders = [];
      return total;
   }
}

module.export = new LoadManager();
