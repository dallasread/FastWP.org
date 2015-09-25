var Route = require('../../utils/route'),
    config = {
        templates: {
            index: require('../../views/accounts/sign-up.hbs')
        },
        interactions: {
            signUp: {
                event: 'submit',
                target: '[action="sign-up"]',
                listener: function signUpInteraction(e, $el) {
                    var _ = this;
                    _.signUp({
                        email: $el.find('[name="email"]').val(),
                        password: $el.find('[name="password"]').val()
                    });
                    return false;
                }
            }
        }
    };

var AccountsSignUp = Route.generate(function AccountsSignUp(options) {
    var _ = this;

    _.beforeFilters = [
        require('./signed-in-redirect')(_),
    ];

    _.supercreate(options, config);
});

AccountsSignUp.definePrototype({
    signUp: function signUp(data) {
        var _ = this;

        _.app.api('/users', {
            method: 'POST'
        }, function(err, user) {
            if (err) return alert(err.join(', '));

            _.app.user = user;
            _.app.go('/');
            _.app.setAuthToken(user && user.auth_token);
        });
    }
});

module.exports = AccountsSignUp;
