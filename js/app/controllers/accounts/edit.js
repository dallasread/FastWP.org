var Route = require('../../utils/route'),
    config = {
        templates: {
            index: require('../../views/accounts/edit.hbs')
        },
        interactions: {
            signUp: {
                event: 'submit',
                target: '.form[action="edit"]',
                listener: function signUpInteraction(e, $el) {
                    var _ = this;
                    _.edit({
                        name: $el.find('[name="name"]').val(),
                        email: $el.find('[name="email"]').val(),
                        password: $el.find('[name="password"]').val(),
                        plan_id: $el.find('[name="plan_id"]').val()
                    });
                    return false;
                }
            },
            changeCC: {
                event: 'click',
                target: '.change-cc',
                listener: function changeCard(e, $el) {
                    var _ = this;
                    _.$element.find('.non-cc-field').remove();
                    _.$element.find('.cc-field').fadeIn();
                    _.$element.find('.cc-field input:visible:first').trigger('focus');
                    return false;
                }
            }
        }
    };

var AccountsEdit = Route.generate(function AccountsEdit(options) {
    var _ = this;

    _.beforeFilters = [
        require('../helpers/find-user')(_),
        require('../helpers/include-stripe')(_),
        require('../helpers/find-plans')(_)
    ];

    _.defineProperties({
        title: 'My Account'
    });

    _.supercreate(options, config);
});

AccountsEdit.definePrototype({
    edit: function edit(data) {
        var _ = this,
            $form = _.$element.find('.form[action="edit"]'),
            cc = $form.find('#number').val();

        $form.attr('disabled', true);

        if (cc.length) {
            window.Stripe.card.createToken($form, function(status, response) {
                if (response.error) {
                    alert(response.error.message);
                    $form.removeAttr('disabled');
                } else {
                    data.stripe_token = response.id;
                    _.submit(data);
                }
            });
        } else {
            _.submit(data);
        }
    },

    submit: function submit(data) {
        var _ = this,
            $form = _.$element.find('.form[action="edit"]');

        $form.attr('disabled', true);

        if (!data.password.length) delete data.password;

        _.app.api('/users/' + _.app.user.id, {
            method: 'PUT',
            data: data
        }, function(err, user) {
            $form.removeAttr('disabled');

            if (err) {
                alert(err.join(', '));
                return;
            }

            alert('Your account has been saved!');

            _.app.user = user;
        });
    }
});

module.exports = AccountsEdit;
