var Route = require('../../utils/route'),
    config = {
        templates: {
            index: require('../../views/accounts/sign-up.hbs')
        },
        interactions: {
            signUp: {
                event: 'submit',
                target: '[action="sign-up"]',
                listener: function signUpInteraction(e, $el) {
                    var _ = this;
                    _.signUp({
                        name: $el.find('[name="name"]').val(),
                        email: $el.find('[name="email"]').val(),
                        password: $el.find('[name="password"]').val(),
                        plan_id: $el.find('[name="plan_id"]').val()
                    });
                    return false;
                }
            }
        }
    };

var AccountsSignUp = Route.generate(function AccountsSignUp(options) {
    var _ = this;

    _.beforeFilters = [
        require('../helpers/signed-in-redirect')(_),
        require('../helpers/include-stripe')(_),
        require('../helpers/find-plans')(_)
    ];

    _.supercreate(options, config);
});

AccountsSignUp.definePrototype({
    signUp: function signUp(data) {
        var _ = this,
            $form = _.$element.find('[action="sign-up"]');

        $form.attr('disabled', true);

        window.Stripe.card.createToken($form, function(status, response) {
            if (response.error) {
                alert(response.error.message);
                $form.removeAttr('disabled');
            } else {
                data.stripe_token = response.id;

                _.app.api('/users', {
                    method: 'POST',
                    public: true,
                    data: data
                }, function(err, user) {
                    if (err) {
                        $form.removeAttr('disabled');
                        alert(err.join(', '));
                        return;
                    }


                    console.log(user);

                    _.app.user = user;
                    _.app.go('/');
                    _.app.setAuthToken(user && user.auth_token);
                });
            }
        });
    }
});

module.exports = AccountsSignUp;
