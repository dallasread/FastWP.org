var Route = require('../../utils/route'),
    config = {
        templates: {
            index: require('../../views/accounts/sign-in.hbs')
        },
        interactions: {
            signIn: {
                event: 'submit',
                target: '[action="sign-in"]',
                listener: function signInInteraction(e, $el) {
                    var _ = this;
                    _.signIn({
                        email: $el.find('[name="email"]').val(),
                        password: $el.find('[name="password"]').val()
                    });
                    return false;
                }
            }
        }
    };

var AccountsSignIn = Route.generate(function AccountsSignIn(options) {
    var _ = this;

    _.beforeFilters = [
        require('./signed-in-redirect')(_),
    ];

    _.supercreate(options, config);
});

AccountsSignIn.definePrototype({
    signIn: function signIn(credentials) {
        var _ = this;

        _.app.loading();

        _.app.api('/me', {
            method: 'GET',
            credentials: credentials
        }, function (err, user) {
            if (err) {
                alert('Could not sign in.');
                window.location = window.location.href.split('#')[0];
                return;
            }

            _.app.user = user;
            _.app.go('/');
            _.app.setAuthToken(user && user.auth_token);
        });
    }
});

module.exports = AccountsSignIn;
