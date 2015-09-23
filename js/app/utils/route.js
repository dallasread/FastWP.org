var CustomElement = require('generate-js-custom-element'),
    Key = require('./key');

var Route = CustomElement.generate(function Route(options, config) {
    var app = options.app;
    delete options.app;
    options.key = Key(options);
    options.app = app;

    var _ = this,
        $element = $('<div>')
            .addClass(options.blueprint.substring(1).replace(/\//g, '-').replace(/[^-0-9A-Za-z]/g, '') + '-controller')
            .data('key', options.key);

    _.supercreate($element, config || {
        templates: {
            index: 'No template set {{key}}.'
        }
    });

    _.defineProperties({
        writable: true
    }, {
        cacheable: true
    });

    _.defineProperties(options);
});

Route.definePrototype({
    // onShow: function onShow() {}
});

module.exports = Route;
