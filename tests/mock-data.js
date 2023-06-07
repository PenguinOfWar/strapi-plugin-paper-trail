const trail = {
  someText: 'Foobar123456123123123',
  publishedAt: '2023-06-05T15:38:30.608Z',
  locale: 'en',
  localizations: [4]
};

module.exports = {
  entityServiceResponse: {
    id: 5,
    recordId: '2',
    contentType: 'api::another-type.another-type',
    version: 4,
    change: 'UPDATE',
    content: {
      locale: 'en',
      someText: 'Foobar123456123123123',
      publishedAt: '2023-06-05T15:38:30.608Z',
      localizations: [4]
    },
    createdAt: '2023-06-06T09:22:08.025Z',
    updatedAt: '2023-06-06T09:22:08.025Z'
  },
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
  schema: {
    kind: 'collectionType',
    collectionName: 'another_types',
    info: {
      singularName: 'another-type',
      pluralName: 'another-types',
      displayName: 'AnotherType',
      description: ''
    },
    options: { draftAndPublish: true },
    pluginOptions: { paperTrail: { enabled: true }, i18n: { localized: true } },
    attributes: {
      someText: { type: 'string', pluginOptions: [Object] },
      createdAt: { type: 'datetime' },
      updatedAt: { type: 'datetime' },
      publishedAt: {
        type: 'datetime',
        configurable: false,
        writable: true,
        visible: false
      },
      createdBy: {
        type: 'relation',
        relation: 'oneToOne',
        target: 'admin::user',
        configurable: false,
        writable: false,
        visible: false,
        useJoinTable: false,
        private: true
      },
      updatedBy: {
        type: 'relation',
        relation: 'oneToOne',
        target: 'admin::user',
        configurable: false,
        writable: false,
        visible: false,
        useJoinTable: false,
        private: true
      },
      localizations: {
        writable: true,
        private: false,
        configurable: false,
        visible: false,
        type: 'relation',
        relation: 'oneToMany',
        target: 'api::another-type.another-type'
      },
      locale: {
        writable: true,
        private: false,
        configurable: false,
        visible: false,
        type: 'string'
      }
    },
    __schema__: {
      collectionName: 'another_types',
      info: {
        singularName: 'another-type',
        pluralName: 'another-types',
        displayName: 'AnotherType',
        description: ''
      },
      options: { draftAndPublish: true },
      pluginOptions: { paperTrail: [Object], i18n: [Object] },
      attributes: { someText: [Object] },
      kind: 'collectionType'
    },
    modelType: 'contentType',
    modelName: 'another-type',
    connection: 'default',
    uid: 'api::another-type.another-type',
    apiName: 'another-type',
    globalId: 'AnotherType',
    actions: {},
    lifecycles: {}
  },
  uid: 'api::another-type.another-type',
  type: 'UPDATE',
  isAdmin: true
};
