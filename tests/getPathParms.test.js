const getPathParams = require('../server/utils/getPathParams');

describe('utils: getPathParams', () => {
  it('should return params from valid admin paths', async function () {
    const result1 = getPathParams(
      '/content-manager/collection-types/foo-type',
      1
    );
    const result2 = getPathParams(
      '/content-manager/collection-types/foo-type/',
      1
    );
    const result3 = getPathParams(
      '/content-manager/collection-types/foo-type/42',
      1
    );
    const result4 = getPathParams(
      '/content-manager/collection-types/api::another-type.another-type/4?locale=en',
      1
    );

    expect(result1.contentTypeName).toBe('foo-type');
    expect(result2.contentTypeName).toBe('foo-type');
    expect(result3.contentTypeName).toBe('foo-type');
    expect(result3.contentTypeId).toBe('42');
    expect(result4.contentTypeName).toBe('api::another-type.another-type');
    expect(result4.contentTypeId).toBe('4');
  });

  it('should return params from valid api paths', async function () {
    const result1 = getPathParams('/api/foo-type', 0);
    const result2 = getPathParams('/api/foo-type/', 0);
    const result3 = getPathParams('/api/foo-type/42', 0);

    expect(result1.contentTypeName).toBe('foo-type');
    expect(result2.contentTypeName).toBe('foo-type');
    expect(result3.contentTypeName).toBe('foo-type');
    expect(result3.contentTypeId).toBe('42');
  });
});
