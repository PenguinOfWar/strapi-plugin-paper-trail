function getUser(trail = {}) {
  const { admin_user, users_permissions_user } = trail;

  if (!admin_user && !users_permissions_user) {
    return 'Unknown';
  }

  if (admin_user) {
    return [admin_user.firstname, admin_user.lastname, '(Admin)']
      .filter(Boolean)
      .join(' ');
  }

  if (users_permissions_user) {
    return `${users_permissions_user.email} (User)`;
  }
}

export default getUser;
