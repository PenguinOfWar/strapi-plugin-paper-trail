const { context, uid, schema } = require('./mock-data');
const checkContext = require('../server/utils/checkContext');

describe('utils: checkContext', () => {
  beforeEach(async function () {
    global.strapi = {
      contentTypes: {
        [uid]: schema
      }
    };
  });

  it('should parse the context and return useful fragments', async function () {
    const { schema, uid, isAdmin, change } = checkContext(context);

    expect(schema.kind).toBe('collectionType');
    expect(schema.info.pluralName).toBe('another-types');
    expect(uid).toBe('api::test-content-type.test-content-type');
    expect(isAdmin).toBe(true);
    expect(change).toBe('UPDATE');
  });
});
