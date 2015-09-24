var Route = require('../../utils/route'),
    config = {
        templates: {
            index: require('../../views/installations/index.hbs')
        }
    };

var InstallationsIndex = Route.generate(function InstallationsIndex(options) {
    var _ = this;

    _.beforeFilters = [
        require('../accounts/find-user')(_)
    ];

    _.defineProperties({
        title: 'Installations'
    });

    _.supercreate(options, config);
});

InstallationsIndex.definePrototype({

});

module.exports = InstallationsIndex;
