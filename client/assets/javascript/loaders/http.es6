const Loader = require('./main.js');
const $ = require('../../externals/jquery/dist/jquery.js');

class HTTPLoader {
   // TODO: extends cache
   constructor(src) {
      this.src = src;
   }

   loadPromise() {
      var deferred = $.Deferred();
      this.load( (source) => {
         deferred.resolve(source);
      }, (error) => {
         throw error;
         deferred.fail(error);
      });
      return deferred.promise();
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
