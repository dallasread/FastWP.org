var Route = require('../../utils/route'),
    config = {
        templates: {
            index: require('../../views/sites/form.hbs')
        },
        interactions: {
            submit: {
                event: 'submit',
                target: '[action="site-form"]',
                listener: function (e, $el) {
                    var _ = this;

                    _.save({
                        domain: $el.find('[name="domain"]').val()
                    });

                    return false;
                }
            }
        }
    };

var SitesForm = Route.generate(function SitesForm(options) {
    var _ = this;

    _.beforeFilters = [
        require('../helpers/find-user')(_)
    ];

    if (options.params.id) {
        _.beforeFilters.push(
            require('../helpers/find-site')(_)
        );
    }

    _.supercreate(options, config);
});

SitesForm.definePrototype({
    save: function save(data) {
        var _ = this,
            url, method;

        if (_.site) {
            url = '/sites/' + _.site.id;
            method = 'PUT';
        } else {
            url = '/sites';
            method = 'POST';
        }

        _.app.api(url, {
            method: method,
            data: data
        }, function(err, site) {
            if (err) {
                alert(err.join(', '));
            } else {
                alert('Site ' + (_.site ? 'updated' : 'created') + ' successfully!');
                _.app.user.sites[site.id] = site;
                _.app.go('/sites/' + site.id + (_.site ? '/edit' : ''), true);
            }
        });
    }
});

module.exports = SitesForm;
