var Route = require('../../utils/route'),
    config = {
        templates: {
            index: require('../../views/installations/history.hbs')
        }
    };

var InstallationsHistory = Route.generate(function InstallationsHistory(options) {
    var _ = this;

    _.beforeFilters = [
        require('../accounts/find-user')(_),
        require('./find-installation')(_)
    ];

    _.supercreate(options, config);
});

InstallationsHistory.definePrototype({
});

module.exports = InstallationsHistory;
