var Route = require('../../utils/route'),
    config = {
        templates: {
            index: require('../../views/sites/index.hbs')
        }
    };

var SitesIndex = Route.generate(function SitesIndex(options) {
    var _ = this;

    _.beforeFilters = [
        require('../helpers/find-user')(_)
    ];

    _.defineProperties({
        title: 'Sites'
    });

    _.supercreate(options, config);
});

SitesIndex.definePrototype({

});

module.exports = SitesIndex;
