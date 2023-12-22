'use strict';

module.exports = {
  schema: {
    kind: 'collectionType',
    collectionName: 'plugin_paper_trail_trails',
    info: {
      singularName: 'trail',
      pluralName: 'trails',
      displayName: 'Trail'
    },
    options: {
      draftAndPublish: false,
      comment: ''
    },
    pluginOptions: {
      'content-manager': {
        visible: true
      },
      'content-type-builder': {
        visible: false
      }
    },
    attributes: {
      recordId: {
        type: 'biginteger',
        required: true
      },
      contentType: {
        type: 'string'
      },
      version: {
        type: 'integer'
      },
      change: {
        type: 'string'
      },
      content: {
        type: 'json'
      },
      admin_user: {
        type: 'relation',
        relation: 'oneToOne',
        target: 'admin::user'
      },
      comment: {
        type: 'text'
      },
      fieldComments: {
        type: 'json'
      },
      status: {
        type: 'enumeration',
        enum: ['pending', 'approved', 'changes_required'],
        default: 'pending'
      }
    }
  }
};
