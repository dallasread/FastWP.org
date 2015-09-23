module.exports = {
    '/my-account': require('./controllers/accounts/edit'),

    '/sign-in': require('./controllers/accounts/sign-in'),
    '/sign-up': require('./controllers/accounts/sign-up'),
    '/sign-out': require('./controllers/accounts/sign-out'),

    '/': require('./controllers/installations/index'),
    '/installations/:id': require('./controllers/installations/show'),
    '/installations/:id/backups': require('./controllers/installations/backups'),
    '/installations/:id/history': require('./controllers/installations/history'),
    '/installations/:id/clone': require('./controllers/installations/clone'),
    '/installations/:id/ssl': require('./controllers/installations/ssl'),
    '/installations/:id/destroy': require('./controllers/installations/destroy'),
};
