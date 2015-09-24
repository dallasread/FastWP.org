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
    _.defineProperties({
        title: 'Sign In'
    });
});

AccountsSignIn.definePrototype({
    signIn: function signIn(credentials) {
        var _ = this;

        _.app.auth(credentials, function (err, user) {
            if (err) return alert('Could not sign in.');

            _.app.user = user;
            _.app.go('/');
        });
    }
});

module.exports = AccountsSignIn;
