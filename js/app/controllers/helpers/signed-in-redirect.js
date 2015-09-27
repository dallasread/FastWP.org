module.exports = function(route) {
    return function signedInRedirect(done) {
        done(route.app.user ? '/' : null);
    };
};
