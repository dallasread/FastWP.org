var Router = require('./utils/router'),
    config = {
        templates: {
            index: require('./views/application/index.hbs')
        }
    };

var App = Router.generate(function App($element, options) {
    var _ = this;

    _.defineProperties({
        routes: require('./routes'),
        sites: {}
    });

    _.supercreate($element, config, options);
});

App.definePrototype({
});

module.exports = window.FWP = App;
