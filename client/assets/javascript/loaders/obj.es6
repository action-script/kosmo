class OBJLoader {
   constructor(src) {
      this.src = src;
   }

   load(onLoad, onError) {
      // TODO: cached loaded elements
 
      var request = new XMLHttpRequest();
      request.overrideMimeType( 'text/plain' );
      request.open( 'GET', this.src, true );

      request.addEventListener('load', function(event) {
         if ( this.status === 200 ) {
            this.source = event.target.response;
            if ( onLoad )
               onLoad(this.source);
         }
         else
            if ( onError )
               onError(event);
      }, false);

      request.addEventListener('error', event => {
         if ( onError )
            onError(event);
      }, false );

      // progress
      request.addEventListener('progress', event => {
         // TODO: progress into global APP
         if ( event.lengthComputable ) {
            var percentComplete = event.loaded / event.total * 100;
            console.log( Math.round(percentComplete, 2) + '% downloaded' );
         }
      }, false );

      request.responseType = 'text';
      request.send();
   }
}

module.exports = OBJLoader;
