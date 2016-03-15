const Router = require('koa-router');
const jsonBody = require('koa-json-body')();
const fs = require('fs');
const co = require('co');

// database conection
var Datastore = require('nedb');

var db = {}; 
db.items = new Datastore({ filename: 'store/items'});
//db.scene = new Datastore({ filename: 'store/scene'});
//db.chains = new Datastore({ filename: 'store/chains'});
for (let key in db)
   db[key].loadDatabase();

// api route
var api = new Router({
  prefix: '/api'
});


api.post('/item/save', jsonBody, function *() {
   console.log(`saving item ${JSON.stringify(this.request.body)}`);
   if (this.request.body != '')
      yield new Promise((resolve, reject) => {
         db.items.insert(this.request.body, (err, newDoc) => {
            if (err != null) {
               this.status = 500;
               this.body = `Error inserting item\n ${error}`;
            }
            else {
               this.status = 200;
               this.body = newDoc._id;
            }
            resolve();
         });
      });
   else {
      this.status = 400;
      this.body = 'no item data';
   }
});


api.get('/item/:id', function * () {
   console.log(`geting item ${this.params.id}`);
   yield new Promise((resolve, reject) => {
      db.items.findOne({ _id: this.params.id }, (err, doc) => {
         if (err != null) {
            this.status = 500;
            this.body = `Error searching item\n ${error}`;
         }
         if (doc === null) {
            this.status = 404;
            this.body = 'item not found';
         }
         else {
            console.log(`item found ${this.params.id}`);
            this.status = 200;
            this.body = doc;
         }
         resolve();
      });
   });

/*
   var filePath = `${__base}/${this.params.id}.obj`;
   var stats = fs.statSync(filePath)

   this.set('Content-Length', stats.size);
   this.type = '.obj';
   this.body = fs.createReadStream(filePath);
*/
});

module.exports = api;
