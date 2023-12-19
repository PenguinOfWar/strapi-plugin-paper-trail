
module.exports = {
  type: 'admin',
  routes: [{
    method: 'POST',
    path: '/draft',
    handler: 'paperTrail.createDraftPaperTrail',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  }],
};
