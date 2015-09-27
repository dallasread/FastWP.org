module.exports = function(route) {
    return function findPlans(done) {
        var _ = route.app;

        if (_.plans) return done();

        _.api('/plans', {
            method: 'GET',
            public: true
        }, function(err, plans) {
            var plan;

            for (var i = 0; i < plans.length; i++) {
                plan = plans[i];

                if (!_.user || _.user.plan_id === plan.id) {
                    plan.isSelected = true;
                    break;
                }
            }

            _.plans = plans;

            done();
        });
    };
};
