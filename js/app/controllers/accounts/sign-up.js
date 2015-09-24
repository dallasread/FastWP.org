var Route = require('../../utils/route'),
    config = {
        templates: {
            index: require('../../views/accounts/sign-up.hbs')
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
});

module.exports = AccountsSignUp;
