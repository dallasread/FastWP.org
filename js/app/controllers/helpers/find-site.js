module.exports = function(route) {
    return function findSite(done) {
        if (route.app.user.sites[route.params.id]) {
            route.site = route.app.user.sites[route.params.id];
        }

        done();
    };
};
