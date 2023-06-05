# Strapi Plugin Paper Trail

Accountability and content versioning for strapi v4+.

## Requirements

1. `node` `v14` or higher
2. `strapi` `v4.10` or higher

## Features

- Automatic revision history and auditing with support for all major strapi content types including relations, media, components, and dynamic zones via the admin panel.
- Roll-back capabilities with the option to select specific fields to restore via the admin panel.
- Tracks revision history by both admins and users.

## Installation

To install this plugin, you need to add an NPM dependency to your Strapi application:

```sh
# Using Yarn
yarn add strapi-plugin-paper-trail

# Or using NPM
npm install strapi-plugin-paper-trail --save
```

Enable the plugin by adding the following in `./config/plugins.js`.

```js
module.exports = {
  // ...
  'paper-trail': {
    enabled: true
  },
  // ...
}
```

Or, if you are using TypeScript, in `./config/plugins.ts`.

```ts
export default {
  // ...
  'paper-trail': {
    enabled: true
  },
  // ...
};

```

Then, you'll need to build your admin panel:

```sh
# Using Yarn
yarn build

# Or using NPM
npm run build
```

## Usage
The functionality of this plugin is opt-in on a per content type basis and can be disabled at any time.

To enable the plugin, edit the content type via the Content-Type Builder screen.

(Screenshot)

Or by modifying the `pluginOption` object on your models `schema.json`.

```json
  // ...
  "pluginOptions": {
    "paperTrail": {
      "enabled": true
    }
  },
  // ...

```

Once enabled on the model, Paper Trail will be listening for changes to your records and will automatically create revisions when records are created or updated. These changes can be viewed directly from the content manager edit view.

For convenience, the plugin will differentiate `CREATE` from `UPDATE` and will display which user made the change (regardless of whether they are an admin or a user permissions plugin user).

(Screenshot)

Clicking 'View all' will show the entire revision history for this record.

(Screenshot)

The revision history for each field that was touched during the `CREATE` or `UPDATE` will be displayed, and you are able to select which fields you would like to restore by checking the checkbox on each accordion.

(Screenshot)

Once you are ready, you will get a final chance to review the entire scope of the fields that will be restored. You can also view the JSON object for debugging purposes (or simply as a way to quickly grok the entire change).

(Screenshot)

Clicking 'Restore' will then immediately overwrite the selected fields on the original record, restoring your revision.

## Notes & Considerations
While I have tried to keep the plugin as simple and intuitive to use as possible, there are some notes and considerations to mention. Some of these are `strapi` specific, some are specific to the challenge of version control, and others are plugin specific challenges.

1. The plugin has currently only been tested on `node v18`, though it should work perfectly on any node version that `strapi v4` directly supports (currently `node v14` and up).
2. The plugin relies on the content type plugin `UID` property to identify the correct content type and associate the revision history. If you change this value you will lose previous revision histories (all revision history records can be manually browsed and modified from `Content Manager > Collection Types > Trail`).
3. There is currently no revision history or auditing bound to `DELETE` events (but it is on the roadmap).
4. This has not been tested with all available custom field plugins, however as long as the custom field plugin implements on top of the core strapi content manager types (e.g. `string`, `text`, `biginteger`, `json`, `component`, and so on) and isn't doing anything too arcane, then it should be fine.
5. The plugin is a middleware listening on the admin and user content management endpoints, making changes directly to the models outside of this scope (e.g. from a custom service or controller) will not be logged as a revision by the plugin), however it shouldn't be difficult to manually implement this if needed.
6. Attempting to restore a unique field with a duplicate value will cause the request to fail.
7. Likewise, attempting to restore a field that has been since deleted from the schema or renamed will cause the attempt to fail.
8. `password` type is not supported for security reasons.
9. The plugin is still in early development, use with caution!
10. Pull requests for new features and fixes welcome and encouraged 🚀

## Roadmap
In no particular order and subject to change depending on priorities.

1. Compare diffs against current vs chosen revision, or two separate revisions.
2. Audit logging for `DELETE` events and restoration of deleted records.
3. Small enhancements to better leverage available `strapi` server hooks instead of custom code.
4. Pagination for longer revision history lists.
5. Plugin management panel for purging revision history.
6. Selecting which field to send the revised change to on the record (supporting schema name changes).
