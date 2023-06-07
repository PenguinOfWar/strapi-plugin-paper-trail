const { trail, schema } = require('./mock-data');
const prepareTrailFromSchema = require('../server/utils/prepareTrailFromSchema');

describe('utils: prepareTrailFromSchema', () => {
  it('should return a sanitized trail', async function () {
    const result = prepareTrailFromSchema(trail, schema);

    expect(result.trail.hasOwnProperty('someText')).toBe(true);
    expect(result.trail.hasOwnProperty('password')).toBe(false);
    expect(result.ignored.hasOwnProperty('id')).toBe(true);
    expect(result.ignored.hasOwnProperty('password')).toBe(true);
  });
});
