const { match } = require('path-to-regexp');

module.exports = (path, isAdmin) => {
  const matchFn = isAdmin
    ? match(
        '/content-manager/collection-types/:contentTypeName/:contentTypeId?'
      )
    : match('/api/:contentTypeName/:contentTypeId?');

  const matches = matchFn(path);

  const { params } = matches;

  return { ...params };
};
