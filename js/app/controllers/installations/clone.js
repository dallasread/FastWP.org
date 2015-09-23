var Route = require('../../utils/route'),
    config = {
        templates: {
            index: require('../../views/installations/clone.hbs')
        }
    };

var InstallationsClone = Route.generate(function InstallationsClone(options) {
    var _ = this;

    _.beforeFilters = [
        require('../accounts/find-user')(_),
        require('./find-installation')(_)
    ];

    _.supercreate(options, config);
});

InstallationsClone.definePrototype({

});

module.exports = InstallationsClone;
