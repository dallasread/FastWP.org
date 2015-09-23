var Route = require('../../utils/route'),
    config = {
        templates: {
            index: require('../../views/accounts/sign-out.hbs')
        }
    };

var AccountsSignOut = Route.generate(function AccountsSignOut(options) {
    var _ = this;

    _.beforeFilters = [
        require('./find-user')(_)
    ];

    _.supercreate(options, config);
});

AccountsSignOut.definePrototype({
});

module.exports = AccountsSignOut;
