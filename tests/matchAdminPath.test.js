const matchAdminPath = require('../server/utils/matchAdminPath');

describe('utils: matchAdminPath', () => {
  it('should match valid paths', async function () {
    const result1 = Boolean(
      matchAdminPath(
        '/content-manager/collection-types/api::another-type.another-type'
      )
    );
    const result2 = Boolean(
      matchAdminPath(
        '/content-manager/collection-types/api::another-type.another-type/2'
      )
    );
    const result3 = Boolean(
      matchAdminPath(
        '/content-manager/collection-types/api::foo-type.bar-type/'
      )
    );
    const result4 = Boolean(
      matchAdminPath(
        '/content-manager/collection-types/api::foo-type.bar-type/1245'
      )
    );

    const result5 = Boolean(
      matchAdminPath('/content-manager/single-types/api::foo-type.bar-type/')
    );

    const result6 = Boolean(
      matchAdminPath('/content-manager/single-types/api::foo-type.bar-type/4')
    );

    expect(result1).toBe(true);
    expect(result2).toBe(true);
    expect(result3).toBe(true);
    expect(result4).toBe(true);
    expect(result5).toBe(true);
    expect(result6).toBe(true);
  });

  it('should reject invalid paths', async function () {
    const result1 = Boolean(matchAdminPath('/api/foo-types'));
    const result2 = Boolean(matchAdminPath('/api/foo-types/'));
    const result3 = Boolean(matchAdminPath('/api/foo-types/4'));

    expect(result1).toBe(false);
    expect(result2).toBe(false);
    expect(result3).toBe(false);
  });
});
