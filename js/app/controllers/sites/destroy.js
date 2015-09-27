var Route = require('../../utils/route'),
    config = {
        templates: {
            index: require('../../views/sites/destroy.hbs')
        },
        interactions: {
            domainChecker: {
                event: 'keyup',
                target: '[name="domain"]',
                listener: function(e, $el) {
                    var _ = this,
                        $form = $el.closest('.form');

                    if ($el.val().toLowerCase() === _.domain) {
                        $form.removeAttr('disabled');
                    } else {
                        $form.attr('disabled', true);
                    }
                }
            },
            submit: {
                event: 'submit',
                target: '.form[action="destroy"]',
                listener: function (e, $el) {
                    var _ = this;

                    if ($el.attr('disabled')) {
                        alert('Please enter the domain name to confirm your intentions.');
                    } else {
                        _.destroy();
                    }

                    return false;
                }
            }
        }
    };

var SitesDestroy = Route.generate(function SitesDestroy(options) {
    var _ = this;

    _.beforeFilters = [
        require('../helpers/find-user')(_),
        require('../helpers/find-site')(_),
        function setDomain(done) {
            _.domain = _.site.domain.toLowerCase();
            done();
        }
    ];

    _.supercreate(options, config);
});

SitesDestroy.definePrototype({
    destroy: function destroy() {
        var _ = this;

        _.app.api('/sites/' + _.site.id, {
            method: 'DELETE'
        }, function(err, site) {
            if (err) {
                alert(err.join(', '));
            } else {
                alert('Site deleted successfully!');
                delete _.app.user.sites[_.site.id];
                _.app.go('/');
            }
        });
    }
});

module.exports = SitesDestroy;
