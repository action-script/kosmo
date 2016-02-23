var exports = module.exports = {};
exports.index = function *() {
   this.state.page_title = 'Koa-test 2';
   this.state.page_description = 'page description text test';

   yield this.render('index', { text: 'hello World' });
}

