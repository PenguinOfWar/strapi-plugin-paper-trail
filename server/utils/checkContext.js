const allowedMethods = require('./allowedMethods');
const allowedStatuses = require('./allowedStatuses');
const getContentTypeSchema = require('./getContentTypeSchema');
const getPathParams = require('./getPathParams');
const matchAdminPath = require('./matchAdminPath');
const matchApiPath = require('./matchApiPath');
const getChangeType = require('./getChangeType');

module.exports = context => {
  const { method, url } = context.request;
  const { status } = context.response;

  /**
   * We have a few things to check here. We're only interested in:
   * - POST | PUT | DELETE methods
   * - Routes that match a regex (admin content type endpoint or content type generated endpoint)
   */

  const allowedStatusCheck = allowedStatuses.includes(status);
  const allowedMethodsCheck = allowedMethods.includes(method);
  const adminMatchCheck = Boolean(matchAdminPath(url));
  const apiMatchCheck = Boolean(matchApiPath(url));

  if (
    allowedStatusCheck &&
    allowedMethodsCheck &&
    (adminMatchCheck || apiMatchCheck)
  ) {
    const params = getPathParams(url, adminMatchCheck);

    const { contentTypeName } = params;

    const schema = getContentTypeSchema(contentTypeName, adminMatchCheck);

    if (!schema) {
      return { contentTypeName: null, schema: null };
    }

    const uid = schema.uid;
    const change = getChangeType(method);

    return { schema, uid, isAdmin: adminMatchCheck, change };
  }

  return { contentTypeName: null, schema: null };
};
