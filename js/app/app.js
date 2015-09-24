var Router = require('./utils/router'),
    config = {
        templates: {
            index: require('./views/application/index.hbs')
        },
        interactions: {
            click: {
                event: 'ontouchstart' in document.documentElement ? 'touchstart' : 'click',
                target: 'a[href^="#!"]',
                listener: function(e, $el) {
                    window.location.hash = $el.attr('href');
                    return false;
                }
            }
        }
    };

function getCookie(name) {
    var value = '; ' + document.cookie;
    var parts = value.split('; ' + name + '=');
    if (parts.length == 2) return parts.pop().split(';').shift();
}

var App = Router.generate(function App($element, options) {
    var _ = this,
        authToken = getCookie('FWP-API-authToken');

    _.defineProperties({
        routes: require('./routes'),
        installations: {}
    });

    _.supercreate($element, config, options);

    if (authToken) {
        _.auth({ authToken: authToken }, function(err, user) {
            if (!err) {
                _.user = user;
                _.go('/');
                _.update(_);
            }
        });
    }
});

App.definePrototype({
    auth: function auth(credentials, done) {
        var _ = this,
            headers = {},
            authTokenString = '';

        if (credentials.authToken) {
            authTokenString = '?auth_token=' + credentials.authToken;
        } else {
            headers = {
                Authorization: 'Basic ' + btoa(credentials.email + ':' + credentials.password)
            };
        }

        $.ajax({
            url: _.apiURL + '/me' + authTokenString,
            headers: headers,
            complete: function(data) {
                var user;

                try {
                    user = JSON.parse(data.responseText);
                } catch (e) {}

                document.cookie = 'FWP-API-authToken=' + (user ? user.auth_token : '') + ';';
                done(!user || user.errors, user);
            }
        });
    }
});

module.exports = window.FWP = App;
