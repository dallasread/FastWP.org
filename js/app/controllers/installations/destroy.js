var Route = require('../../utils/route'),
    config = {
        templates: {
            index: require('../../views/installations/destroy.hbs')
        }
    };

var InstallationsDestroy = Route.generate(function InstallationsDestroy(options) {
    var _ = this;

    _.beforeFilters = [
        require('../accounts/find-user')(_),
        require('./find-installation')(_)
    ];

    _.supercreate(options, config);
});

InstallationsDestroy.definePrototype({
});

module.exports = InstallationsDestroy;
