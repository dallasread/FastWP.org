module.exports = function(route) {
    return function findSite(done) {
        if (route.app.sites[route.params.id]) {
            route.site = route.app.sites[route.params.id];
            return done();
        }

        setTimeout(function() {
            // route.site = route.app.sites[route.params.id] = {
            //     name: 'Hi',
            //     id: route.params.id
            // };

            done();
        }, 500);
    };
};
