var Route = require('../../utils/route'),
    config = {
        templates: {
            index: require('../../views/sites/show.hbs')
        }
    };

var SitesShow = Route.generate(function SitesShow(options) {
    var _ = this;

    _.beforeFilters = [
        require('../helpers/find-user')(_),
        require('../helpers/find-site')(_)
    ];

    _.supercreate(options, config);
});

SitesShow.definePrototype({
});

module.exports = SitesShow;
