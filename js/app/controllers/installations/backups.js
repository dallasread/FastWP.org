var Route = require('../../utils/route'),
    config = {
        templates: {
            index: require('../../views/installations/backups.hbs')
        }
    };

var InstallationsBackups = Route.generate(function InstallationsBackups(options) {
    var _ = this;

    _.beforeFilters = [
        require('../accounts/find-user')(_),
        require('./find-installation')(_)
    ];

    _.supercreate(options, config);
});

InstallationsBackups.definePrototype({
});

module.exports = InstallationsBackups;
