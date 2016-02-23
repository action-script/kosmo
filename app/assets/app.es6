/*
 * Author Nuño de la Serna.
 * Copyrights licensed under the Apache License v2.0.
 * See the accompanying LICENSE file for terms.
 */

var koa = require('koa');
var hbs = require('koa-hbs');
var _ = require('koa-route');
var route = require('./route');

var app = koa();

// render with handlebars
app.use(hbs.middleware( {
   extname: '.handlebars',
   viewPath: __dirname + '/views',
   partialsPath: __dirname + '/views/partials',
   layoutsPath: __dirname + '/views/layout',
   defaultLayout: 'default'
}));

// route
app.use(_.get('/', route.index));

app.listen(3000);
