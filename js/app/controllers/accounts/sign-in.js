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
                    _.signIn($el.find('[name="email"]'), $el.find('[name="password"]'));
                    return false;
                }
            }
        }
    };

var AccountsSignIn = Route.generate(function AccountsSignIn(options) {
    var _ = this;

    _.supercreate(options, config);
    _.defineProperties({
        title: 'Sign In'
    });
});

AccountsSignIn.definePrototype({
    signIn: function signIn(email, password) {
        var _ = this;

        _.app.user = {
            name: 'Hi',
            id: 123
        };

        _.app.sites['123'] = {
            id: 123,
            name: 'FastWordPress.org'
        };

        _.app.sites['234'] = {
            id: 234,
            name: 'BrandInABox.org'
        };

        _.app.sites['345'] = {
            id: 345,
            name: 'ExciteCreative.ca'
        };

        _.app.sites['456'] = {
            id: 456,
            name: 'BrilliantLabs.ca'
        };

        _.app.go('/');
    }
});

module.exports = AccountsSignIn;
