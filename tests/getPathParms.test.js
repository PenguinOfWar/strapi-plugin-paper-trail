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

    expect(result1.contentTypeName).toBe('foo-type');
    expect(result2.contentTypeName).toBe('foo-type');
    expect(result3.contentTypeName).toBe('foo-type');
    expect(result3.contentTypeId).toBe('42');
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
