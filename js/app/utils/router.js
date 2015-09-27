var CustomElement = require('generate-js-custom-element'),
    Key = require('./key'),
    async = require('async');

var Router = CustomElement.generate(function Router($element, config, options) {
    var _ = this,
        path = window.location.hash;

    _.supercreate($element, config);
    _.defineProperties(options);
    _.defineProperties({
        routesCache: {}
    });

    $(window).on('hashchange', function() {
        var path = window.location.hash;
        _.go(path);
    });

    _.go(path);
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

    go: function go(path, reloadIfNecessary) {
        if (!reloadIfNecessary && path !== window.location.hash) {
            window.location.hash = '#!' + path.replace(/[#|!]/, '');
            return;
        }

        var _ = this,
            uri = _.parseURI(path),
            cache;

        if (!uri.route) return;

        cache = false && _.routesCache[Key(uri)];

        if (cache) {
            _.current = cache;
        } else {
            uri.app = _;
            _.current = uri.route.create(uri);

            if (_.current.cacheable) {
                _.routesCache[_.current.key] = _.current;
            }
        }

        _.loading();
        _.$element.find('[href]').removeClass('active');
        _.$element.find('[href="#!' + uri.path + '"]').addClass('active');

        async.waterfall(_.current.beforeFilters || [], function(err) {
            if (typeof err === 'string') return _.go(err);

            _.$element.find('[data-main]').html( _.current.$element );

            if (cache) {
                _.current.parseInteractions(_.current.interactions);
            }

            _.update(_);
            _.current.update(_.current);
            _.current.$element.find('[autofocus]:first').trigger('focus');

            _.$element.find('[href]').removeClass('active');
            _.$element.find('[href="#!' + uri.path + '"]').addClass('active');

            _.unloading();
        });
    },

    loading: function loading() {},
    unloading: function unloading() {}
});

module.exports = window.FWP = Router;
