const getContentTypeSchema = require('../server/utils/getContentTypeSchema');
const { uid, schema } = require('./mock-data');

describe('utils: getContentTypeSchema', () => {
  beforeEach(async function () {
    global.strapi = {
      contentTypes: {
        [uid]: schema
      }
    };
  });

  it('should return the correct admin schema object', async function () {
    const result = getContentTypeSchema(uid, 1);
    expect(result.kind).toBe('collectionType');
    expect(result.collectionName).toBe('another_types');
  });

  it('should return the correct user schema object', async function () {
    const result = getContentTypeSchema('another-types', 0);

    expect(result.kind).toBe('collectionType');
    expect(result.collectionName).toBe('another_types');
  });
});
