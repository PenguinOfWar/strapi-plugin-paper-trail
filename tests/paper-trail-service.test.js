const paperTrailService = require('../server/services/paper-trail');

describe('Paper trail service', () => {
  let strapi;
  beforeEach(async function () {
    strapi = {
      entityService: {
        create: jest.fn().mockReturnValue()
      }
    };
  });
  it('should create a new paper trail', async function () {
    const response = strapi.entityService.create('foo', { bar: 'baz' });

    console.log(response);
  });
});
