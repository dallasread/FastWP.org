var Route = require('../../utils/route'),
    config = {
        templates: {
            index: require('../../views/installations/ssl.hbs')
        }
    };

var InstallationsSSL = Route.generate(function InstallationsSSL(options) {
    var _ = this;

    _.beforeFilters = [
        require('../accounts/find-user')(_),
        require('./find-installation')(_)
    ];

    _.supercreate(options, config);
});

InstallationsSSL.definePrototype({
});

module.exports = InstallationsSSL;
