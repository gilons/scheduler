var handlebars = require('express3-handlebars');

module.exports = function (app) {
    // store environment env
    var env = handlebars.configure(['views/', 'views2/'], {
        autoescape: true,
        express: app
    });

    // This is filter example. You can use it by {{varname | myFilter}} in template
    env.addFilter('myFilter', function (text) {
        return text.toUpperCase();
    });
};