var CustomElement = require('generate-js-custom-element'),
    config = {
        templates: {
            index: require('./templates/index.hbs')
        },
        interactions: {
            visit: {
                event: 'click',
                target: '.menu a',
                listener: function visitListener(e, $el) {
                    var _ = this;
                    _.$element.find('.active').removeClass('active');
                    $el.addClass('active');
                }
            }
        }
    };

var App = CustomElement.generate(function App($element, options) {
    var _ = this;

    _.supercreate($element, config);
    _.defineProperties(options);
});

App.definePrototype({
});

module.exports = window.FWP = App;
