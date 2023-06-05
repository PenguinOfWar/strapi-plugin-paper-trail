const checkContext = require('../utils/checkContext');

module.exports = async (ctx, next) => {
  await next();

  /**
   * Try/Catch so we don't totally mess with the admin panel if something is wrong
   */

  try {
    const { uid, schema, isAdmin, change } = checkContext(ctx);

    if (!schema) {
      return;
    }

    /**
     * If we have a returned schema, check it for paperTrail.enabled
     */

    const { pluginOptions } = schema;

    const enabled = pluginOptions?.paperTrail?.enabled;

    if (enabled) {
      /**
       * Intercept the body and take a snapshot of the change
       */

      const paperTrailService = strapi
        .plugin('paper-trail')
        .service('paperTrailService');

      await paperTrailService.createPaperTrail(
        ctx,
        schema,
        uid,
        change,
        isAdmin
      );
    }
  } catch (Err) {
    console.warn('paper-trail: ', Err);
  }
};
