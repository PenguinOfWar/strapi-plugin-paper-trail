module.exports = (contentTypeUid, isAdmin) => {
  const strapiContentTypes = strapi.contentTypes;

  if (isAdmin) {
    return strapiContentTypes[contentTypeUid];
  } else {
    /**
     * If we don't already have the contentTypeUid from the admin panel we need to find it
     */

    const entries = Object.entries(strapiContentTypes);

    const schema = entries.find(entry => {
      const innerEntry = entry[1];

      if (!innerEntry) {
        return false;
      }

      if (innerEntry.info.pluralName === contentTypeUid) {
        return entry;
      }
    });

    const innerSchema = schema[1];

    return innerSchema;
  }
};
