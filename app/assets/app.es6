/*
 * Author Nuño de la Serna.
 * Copyrights licensed under the Apache License v2.0.
 * See the accompanying LICENSE file for terms.
 */

var koa = require('koa');
var hbs = require('koa-hbs');
var router = require('koa-router')();
var controllers = require('./controllers');
var path = require('path');
 
var app = koa();

// configuration
// TODO: find a better solution for root path
global.__base = path.join(__dirname, '..');
global.config = require(__base + '/config/app_global.json');
app.use(function* (next) {
   for ( let name in config.page ) {
      this.state[`page_${name}`] = config.page[name];
   }
   yield next;
});

// render with handlebars
app.use(hbs.middleware( {
   extname: config.template.format,
   viewPath: __dirname + config.template.viewPath,
   partialsPath: __dirname + config.template.partialsPath,
   layoutsPath: __dirname + config.template.layoutsPath,
   defaultLayout: 'default'
}));

// static files
app.use(require('koa-static')(__base + '/public'));

// page routes
router.get('/', controllers.index)

app.use(router.routes());
app.use(controllers.api.routes());

app.listen(config.server.port);
