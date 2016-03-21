const Loader = require('./main.js');

class HTTPLoader {
   // TODO: extends cache
   constructor(src) {
      this.src = src;
   }

   load(onLoad, onError) {
      // TODO: cached loaded elements
      this.request = new XMLHttpRequest();
      this.request.overrideMimeType( 'text/plain' );
      this.request.open( 'GET', this.src, true );

      this.request.addEventListener('load', function(event) {
         if ( this.status === 200 ) {
            this.source = event.target.response;
            if ( onLoad )
               onLoad(this.source);
         }
         else
            if ( onError )
               onError(event);
      }, false);

      this.request.addEventListener('error', event => {
         if ( onError )
            onError(event);
      }, false );
      
      Loader.addLoad(this);

      this.request.responseType = 'text';
      this.request.send();
   }
}

module.exports = HTTPLoader;
