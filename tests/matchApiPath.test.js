const matchApiPath = require('../server/utils/matchApiPath');

describe('utils: matchApiPath', () => {
  it('should match valid paths', async function () {
    const result1 = Boolean(matchApiPath('/api/another-type'));
    const result2 = Boolean(matchApiPath('/api/another-type/2'));
    const result3 = Boolean(matchApiPath('/api/another-type3'));
    const result4 = Boolean(matchApiPath('/api/another-type3/4'));
    const result5 = Boolean(matchApiPath('/api/another-type3/'));

    expect(result1).toBe(true);
    expect(result2).toBe(true);
    expect(result3).toBe(true);
    expect(result4).toBe(true);
    expect(result5).toBe(true);
  });

  it('should reject invalid paths', async function () {
    const result1 = Boolean(matchApiPath('/some/path/another-type'));
    const result2 = Boolean(
      matchApiPath(
        '/content-manager/collection-types/api::another-type.another-type/2'
      )
    );
    const result3 = Boolean(
      matchApiPath(
        '/content-manager/collection-types/api::another-type.another-type'
      )
    );

    expect(result1).toBe(false);
    expect(result2).toBe(false);
    expect(result3).toBe(false);
  });
});
