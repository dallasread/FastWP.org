var Route = require('../../utils/route'),
    config = {
        templates: {
            index: require('../../views/sites/backups.hbs')
        }
    };

var SitesBackups = Route.generate(function SitesBackups(options) {
    var _ = this;

    _.beforeFilters = [
        require('../helpers/find-user')(_),
        require('../helpers/find-site')(_)
    ];

    _.supercreate(options, config);
});

SitesBackups.definePrototype({
});

module.exports = SitesBackups;
