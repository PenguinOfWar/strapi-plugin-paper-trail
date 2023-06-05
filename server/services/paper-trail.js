'use strict';

const prepareTrailFromSchema = require('../utils/prepareTrailFromSchema');
const entityName = require('../utils/entityName');

module.exports = ({ strapi }) => ({
  async createPaperTrail(context, schema, uid, change, isAdmin) {
    const body = isAdmin ? context.request.body : context.request.body.data;
    const user = context.state.user;
    const userId = user?.id;
    const resBody = isAdmin
      ? context.response.body
      : context.response.body.data;

    const id = resBody.id || resBody?.data?.id;

    /**
     * Early return, if we don't have a record ID for existing or newly created record the trail is useless
     */

    if (!id) {
      return;
    }

    const { trail } = prepareTrailFromSchema(body, schema);

    /**
     * Get all trails belonging to this reecord so we can increment a version number
     */

    const trails = await strapi.entityService.findMany(entityName, {
      fields: ['version'],
      filters: { contentType: uid, recordId: id },
      sort: { version: 'DESC' }
    });

    let version = trails[0] ? trails[0].version + 1 : 1;

    /**
     * build our new trail record
     */

    const newTrail = {
      admin_user: {
        connect: isAdmin && userId ? [{ id: userId }] : [],
        disconnect: []
      },
      change,
      content: trail,
      contentType: uid,
      recordId: id,
      users_permissions_user: {
        connect: !isAdmin && userId ? [{ id: userId }] : [],
        disconnect: []
      },
      version
    };

    /**
     * Save it
     */

    try {
      await strapi.entityService.create(entityName, {
        data: newTrail
      });
    } catch (Err) {
      console.warn('paper-trail: ', Err);
    }

    return trail;
  }
});
