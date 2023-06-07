const trail = {
  id: 5,
  someText: 'Foobar123456123123123',
  publishedAt: '2023-06-05T15:38:30.608Z',
  locale: 'en',
  localizations: [4],
  password: 'foo123'
};

const entityServiceResponse = (change, version) => {
  return {
    id: 5,
    recordId: '2',
    contentType: 'api::another-type.another-type',
    version,
    change,
    content: {
      locale: 'en',
      someText: 'Foobar123456123123123',
      publishedAt: '2023-06-05T15:38:30.608Z',
      localizations: [4]
    },
    createdAt: '2023-06-06T09:22:08.025Z',
    updatedAt: '2023-06-06T09:22:08.025Z'
  };
};

module.exports = {
  entityServiceResponse: (change, version) =>
    entityServiceResponse(change, version),
  trail,
  context: {
    state: {
      user: {
        id: 1
      }
    },
    request: {
      method: 'PUT',
      url: '/content-manager/collection-types/api::another-type.another-type/2',
      body: {
        ...trail,
        data: {
          ...trail
        }
      }
    },
    response: {
      status: 200,
      message: 'OK',
      body: {
        ...trail,
        data: {
          ...trail
        }
      }
    }
  },
  uid: 'api::another-type.another-type',
  schema: {
    kind: 'collectionType',
    collectionName: 'another_types',
    info: {
      singularName: 'another-type',
      pluralName: 'another-types',
      displayName: 'AnotherType',
      description: ''
    },
    options: {
      draftAndPublish: true
    },
    pluginOptions: {
      paperTrail: {
        enabled: true
      },
      i18n: {
        localized: true
      }
    },
    attributes: {
      someText: {
        type: 'string',
        pluginOptions: {
          i18n: {
            localized: true
          }
        }
      },
      password: {
        type: 'password'
      }
    }
  }
};
