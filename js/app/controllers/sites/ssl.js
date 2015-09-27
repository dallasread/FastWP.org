var Route = require('../../utils/route'),
    config = {
        templates: {
            index: require('../../views/sites/ssl.hbs')
        }
    };

var SitesSSL = Route.generate(function SitesSSL(options) {
    var _ = this;

    _.beforeFilters = [
        require('../helpers/find-user')(_),
        require('../helpers/find-site')(_)
    ];

    _.supercreate(options, config);
});

SitesSSL.definePrototype({
});

module.exports = SitesSSL;
