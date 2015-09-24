module.exports = function(route) {
    return function findUser(done) {
        if (!route.app.user) return done('/sign-in');
        done();
    };
};
