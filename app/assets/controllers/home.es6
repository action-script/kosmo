//var exports = module.exports = {};
module.exports = function *() {
   yield this.render('index', { text: 'hello World' });
}

