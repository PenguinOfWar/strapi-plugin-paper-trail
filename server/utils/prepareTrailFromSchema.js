const _ = require('lodash');
module.exports = (update, schema) => {
  /**
   * Ignore the default strapi fields to focus on custom fields
   */
  const ignoreProps = [
    'id',
    'createdAt',
    'updatedAt',
    'createdBy',
    'updatedBy',
    'password' // For security
  ];

  /**
   * Walk the update object and create our trail
   */

  let trail = {};
  let ignored = {};
  if (!_.isEmpty(update)) {
    Object.keys(update).map(key => {
      if (schema.attributes.hasOwnProperty(key) && !ignoreProps.includes(key)) {
        trail[key] = update[key];
      } else {
        ignored[key] = update[key];
      }
    });
  }

  return { trail, ignored };
};
