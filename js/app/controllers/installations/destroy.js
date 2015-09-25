var Route = require('../../utils/route'),
    config = {
        templates: {
            index: require('../../views/installations/destroy.hbs')
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
            }
        }
    };

var InstallationsDestroy = Route.generate(function InstallationsDestroy(options) {
    var _ = this;

    _.beforeFilters = [
        require('../accounts/find-user')(_),
        require('./find-installation')(_),
        function setDomain(done) {
            _.domain = _.installation.domain.toLowerCase();
            done();
        }
    ];

    _.supercreate(options, config);
});

InstallationsDestroy.definePrototype({
});

module.exports = InstallationsDestroy;
