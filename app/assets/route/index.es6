var exports = module.exports = {};
exports.index = function *() {
   yield this.render('index', { text: 'hello World' });
}

