const paperTrailService = require('../server/services/paper-trail');
const { context, entityServiceResponse, uid } = require('./mock-data');
const { schema } = require('../server/content-types/trail');

describe('service: paper-trail - CREATE', () => {
  let strapi;
  beforeEach(async function () {
    strapi = {
      entityService: {
        create: jest.fn().mockReturnValue(entityServiceResponse('CREATE', 1)),
        findMany: jest.fn().mockReturnValue([])
      }
    };
  });
  it('should create a new paper trail', async function () {
    const paperTrail = await paperTrailService({ strapi }).createPaperTrail(
      context,
      schema,
      uid,
      'CREATE',
      false
    );

    expect(strapi.entityService.findMany).toBeCalledTimes(1);
    expect(strapi.entityService.create).toBeCalledTimes(1);
    expect(paperTrail.change).toBe('CREATE');
    expect(paperTrail.version).toBe(1);
  });
});

describe('service: paper-trail - UPDATE', () => {
  let strapi;
  beforeEach(async function () {
    strapi = {
      entityService: {
        create: jest.fn().mockReturnValue(entityServiceResponse('UPDATE', 4)),
        findMany: jest.fn().mockReturnValue(entityServiceResponse('UPDATE', 4))
      }
    };
  });
  it('should create a new paper trail', async function () {
    const paperTrail = await paperTrailService({ strapi }).createPaperTrail(
      context,
      schema,
      uid,
      'CREATE',
      false
    );

    expect(strapi.entityService.findMany).toBeCalledTimes(1);
    expect(strapi.entityService.create).toBeCalledTimes(1);
    expect(paperTrail.change).toBe('UPDATE');
    expect(paperTrail.version).toBe(4);
  });
});
