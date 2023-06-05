'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('paper-trail')
      .service('myService')
      .getWelcomeMessage();
  },
});
