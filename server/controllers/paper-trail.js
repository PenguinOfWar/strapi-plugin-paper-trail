const getContentTypeSchema = require("../utils/getContentTypeSchema");

module.exports = ({ strapi }) => ({
  async createDraftPaperTrail(ctx) {
    try {
      const body = ctx.request.body;
      const isAdmin = true;
      const uid = body.contentType;
      const schema = getContentTypeSchema(uid, isAdmin);
      const change = 'DRAFT';

      const paperTrailService = strapi
        .plugin('paper-trail')
        .service('paperTrailService');

        console.log(
          schema,
        uid,
        change,
        isAdmin
        );

      await paperTrailService.createPaperTrail(
        ctx,
        schema,
        uid,
        change,
        isAdmin
      );

      ctx.send();
    } catch (err) {
      console.error(err);
      ctx.status = 500;
      ctx.send('Internal Server Error');
    }
  },
});
