var Route = require('../../utils/route'),
    config = {
        templates: {
            index: require('../../views/accounts/sign-out.hbs')
        }
    };

var AccountsSignOut = Route.generate(function AccountsSignOut(options) {
    var _ = this;

    _.beforeFilters = [
        function signOut(done) {
            _.app.user = null;
            document.cookie = 'FWP-API-authToken=;';
            window.location = window.location.href.split('#')[0];
        }
    ];

    _.supercreate(options, config);
});

module.exports = AccountsSignOut;
