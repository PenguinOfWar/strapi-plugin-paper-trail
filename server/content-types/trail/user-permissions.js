module.exports = {
  users_permissions_user: {
    type: 'relation',
    relation: 'oneToOne',
    target: 'plugin::users-permissions.user'
  }
};
