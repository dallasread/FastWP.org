module.exports = function(route, silent) {
    return function findUser(done) {
        var _ = route.app;

        if (_.user) return done();

        _.api('/me', {
            method: 'GET'
        }, function(err, user) {
            if (err) {
                done(silent ? null : '/sign-in');
            } else {
                _.user = user;
                done();
            }
        });
    };
};
