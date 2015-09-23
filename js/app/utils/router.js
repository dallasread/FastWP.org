var CustomElement = require('generate-js-custom-element'),
    Key = require('./key'),
    async = require('async');

var Router = CustomElement.generate(function Router($element, config, options) {
    var _ = this;

    _.supercreate($element, config);
    _.defineProperties(options);
    _.defineProperties({
        routesCache: {}
    });

    _.go(_.current || window.location.hash || '/');

    $(window).on('hashchange', function() {
        var path = window.location.hash;
        _.go(path);
    });
});

Router.definePrototype({
    parseURI: function parseURI(path) {
        path = path.replace(/#!/, '');

        var _ = this,
            params = {},
            splitPath = path.split('/'),
            route, splitRoute, isEqual, isDynamic, key;

        routesLoop:
        for (key in _.routes) {
            splitRoute = key.split('/');

            pathLoop:
            for (var i = 0; i < splitPath.length; i++) {
                isDynamic = splitRoute[i] && splitRoute[i][0] === ':';
                isEqual = splitPath[i] === splitRoute[i];

                if (isDynamic) {
                    params[splitRoute[i].replace(/:/, '')] = splitPath[i];
                }

                if (isDynamic || isEqual) {
                    if (i === splitPath.length - 1) { // LAST
                        route = _.routes[key];
                        break routesLoop;
                    } else {
                        continue pathLoop;
                    }
                }

                params = {};
                break pathLoop;
            }
        }

        return {
            path: path,
            blueprint: key,
            route: route,
            params: params
        };
    },

    go: function go(path) {
        if (path !== window.location.hash) {
            window.location.hash = '#!' + path.replace(/[#|!]/, '');
            return;
        }

        var _ = this,
            uri = _.parseURI(path),
            cache;

        if (!uri.route) return;

        cache = _.routesCache[Key(uri)];

        if (cache) {
            _.current = cache;
        } else {
            uri.app = _;
            _.current = uri.route.create(uri);

            if (_.current.cacheable) {
                _.routesCache[_.current.key] = _.current;
            }
        }

        _.$element.find('[data-main]').html( '<p class="loading">Loading...</p>' );
        _.$element.find('[href]').removeClass('active');
        _.$element.find('[href="#!' + uri.path + '"]').addClass('active');

        async.waterfall(_.current.beforeFilters || [], function(err) {
            if (err) return _.go(err);

            _.$element.find('[data-main]').html( _.current.$element );

            _.update(_);
            _.current.update(_.current);

            _.$element.find('[href]').removeClass('active');
            _.$element.find('[href="#!' + uri.path + '"]').addClass('active');
        });
    }
});

module.exports = window.FWP = Router;