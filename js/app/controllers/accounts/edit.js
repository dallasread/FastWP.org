var Route = require('../../utils/route'),
    config = {
        templates: {
            index: require('../../views/accounts/edit.hbs')
        }
    };

var AccountsEdit = Route.generate(function AccountsEdit(options) {
    var _ = this;

    _.beforeFilters = [
        require('./find-user')(_)
    ];

    _.supercreate(options, config);
});

AccountsEdit.definePrototype({
});

module.exports = AccountsEdit;
