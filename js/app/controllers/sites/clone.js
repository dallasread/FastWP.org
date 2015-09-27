var Route = require('../../utils/route'),
    config = {
        templates: {
            index: require('../../views/sites/clone.hbs')
        },
        interactions: {
            submit: {
                event: 'submit',
                target: '[action="site-clone"]',
                listener: function (e, $el) {
                    var _ = this;

                    _.clone({
                        domain: $el.find('[name="domain"]').val()
                    });

                    return false;
                }
            }
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
    clone: function clone(data) {
        var _ = this;

        _.app.api('/sites/' + _.site.id + '/clone', {
            method: 'POST',
            data: data
        }, function(err, site) {
            if (err) {
                alert(err.join(', '));
            } else {
                alert('Site cloned successfully!');
                _.app.user.sites[site.id] = site;
                _.app.go('/sites/' + site.id);
            }
        });
    }
});

module.exports = SitesShow;
