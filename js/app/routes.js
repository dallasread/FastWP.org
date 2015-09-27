module.exports = {
    '/my-account': require('./controllers/accounts/edit'),

    '/sign-in': require('./controllers/accounts/sign-in'),
    '/sign-up': require('./controllers/accounts/sign-up'),
    '/sign-out': require('./controllers/accounts/sign-out'),

    '/': require('./controllers/sites/index'),
    '/sites/new': require('./controllers/sites/form'),
    '/sites/:id': require('./controllers/sites/show'),
    '/sites/:id/edit': require('./controllers/sites/form'),
    '/sites/:id/clone': require('./controllers/sites/clone'),
    '/sites/:id/backups': require('./controllers/sites/backups'),
    '/sites/:id/ssl': require('./controllers/sites/ssl'),
    '/sites/:id/destroy': require('./controllers/sites/destroy'),
};
