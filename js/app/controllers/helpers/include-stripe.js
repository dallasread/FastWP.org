var Load = require('../../vendor/external-loader.js');

module.exports = function(route) {
    return function includeStripe(done) {
        if (route.app.stripePresent) return done();

        Load('https://js.stripe.com/v2/', function() {
            route.app.stripePresent = true;
            // window.Stripe.setPublishableKey('pk_live_hOZGljGLYRL4CbLOdkPQb5Qv');
            window.Stripe.setPublishableKey('pk_test_oKHPyl4KjoUGQilILY1NmnZ3');
            done();
        });
    };
};
