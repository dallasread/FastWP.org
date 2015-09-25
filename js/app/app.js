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
            },
            fieldFocus: {
                event: 'focus',
                target: '.field input, .field select, .field textarea',
                listener: function(e, $el) {
                    $el.closest('.field').addClass('focus');
                }
            },
            fieldBlur: {
                event: 'blur',
                target: '.field input, .field select, .field textarea',
                listener: function(e, $el) {
                    $el.closest('.field').removeClass('focus');
                }
            },
            focusFirst: {
                event: 'click',
                target: '.focus-first',
                listener: function(e, $el) {
                    $el.closest('[data-main]').find('input:visible, textarea:visible, select:visible').first().trigger('focus');
                    return false;
                }
            },
            goBack: {
                event: 'click',
                target: '.header [href="#!/"].active',
                listener: function(e, $el) {
                    if ($(window).width() < 820) {
                        window.history.go(-1);
                        return false;
                    }
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
        path = window.location.hash;

    _.defineProperties({
        routes: require('./routes'),
        installations: {}
    });

    _.supercreate($element, config, options);

    _.api('/me', {
        method: 'GET',
        credentials: 'apiTokenCookie'
    }, function(err, user) {
        if (err) {
            // _.go(_.current || window.location.hash || '/');
        } else {
            _.user = user;
            _.go(path || '/');
            _.update(_);
        }
    });
});

App.definePrototype({
    api: function api(path, options, done) {
        var _ = this,
            headers = {},
            authTokenString = '';

        if (!path || !options.method) return done(null, null);

        if (options.credentials === 'apiTokenCookie') {
            var authToken = getCookie('FWP-API-authToken');
            if (!authToken) return done(null, null);
            authTokenString = '?auth_token=' + authToken;
        } else if (options.credentials) {
            headers = {
                Authorization: 'Basic ' + btoa(options.credentials.email + ':' + options.credentials.password)
            };
        }

        $.ajax({
            method: options.method,
            url: _.apiURL + path + authTokenString,
            headers: headers,
            complete: function(data) {
                data = data.responseJSON;
                done(!data || data.errors, data);
            }
        });
    },

    setAuthToken: function setAuthToken(authToken) {
        if (typeof authToken !== 'string') return;
        document.cookie = 'FWP-API-authToken=' + authToken + ';';
    },

    loading: function loading() {
        var _ = this;
        _.$element.find('.loading').stop().show();
    },

    unloading: function unloading() {
        var _ = this;
        _.$element.find('.loading').stop().fadeOut();
    }
});

module.exports = window.FWP = App;
