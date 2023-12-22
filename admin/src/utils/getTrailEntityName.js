const getTrailEntityName = ({ trail, contentTypesSettings } = {}) => {
  if (!contentTypesSettings?.length) return trail.recordId;

  const contentTypeSettings = contentTypesSettings.find(
    type => type.uid === trail.contentType
  );
  const name = trail.content[contentTypeSettings.settings.mainField];

  return `${name} (ID ${trail.recordId})`;
};

export default getTrailEntityName;
