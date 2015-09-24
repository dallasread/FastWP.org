module.exports = function(route) {
    return function findInstallation(done) {
        if (route.app.user.installations[route.params.id]) {
            route.installation = route.app.user.installations[route.params.id];
            return done();
        }

        setTimeout(function() {
            // route.installation = route.app.[route.params.id] = {
            //     name: 'Hi',
            //     id: route.params.id
            // };

            done();
        }, 500);
    };
};
