var Route = require('../../utils/route'),
    config = {
        templates: {
            index: require('../../views/installations/show.hbs')
        }
    };

var InstallationsShow = Route.generate(function InstallationsShow(options) {
    var _ = this;

    _.beforeFilters = [
        require('../accounts/find-user')(_),
        require('./find-installation')(_)
    ];

    _.supercreate(options, config);
});

InstallationsShow.definePrototype({
});

module.exports = InstallationsShow;
