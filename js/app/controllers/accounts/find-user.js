module.exports = function(route) {
    return function findUser(done) {
        setTimeout(function() {
            if (!route.app.user) return route.app.go('/sign-in');
            done();
        }, 500);
    };
};
