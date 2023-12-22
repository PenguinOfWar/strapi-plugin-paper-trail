import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import isObject from 'lodash/isObject';

const EXCLUDED_FIELDS = ['publishedAt', '__temp_key__'];

const getTrailChangedFields = ({
  trail,
  originalContent,
  contentTypes,
  components
} = {}) => {
  if (
    !trail ||
    !originalContent ||
    !contentTypes?.length ||
    !components?.length
  )
    return;

  const getType = (schema, attrName) =>
    get(schema, ['attributes', attrName, 'type'], '');
  const getOtherInfos = (schema, arr) =>
    get(schema, ['attributes', ...arr], '');
  const getComponentSchema = uid => components.find(type => type.uid === uid);

  const recursiveGetChangedFields = (
    newContent,
    originalContent,
    schema,
    pathToParent
  ) => {
    return Object.keys(newContent).reduce((acc, current) => {
      if (EXCLUDED_FIELDS.includes(current)) return acc;

      const path = pathToParent ? `${pathToParent}.${current}` : current;
      const attrType = getType(schema, current);

      const value = get(originalContent, current);
      const newValue = get(newContent, current);

      const component = getOtherInfos(schema, [current, 'component']);
      const isRepeatable = getOtherInfos(schema, [current, 'repeatable']);

      let cleanedValue;

      switch (attrType) {
        case 'media':
          const isMultiple =
            getOtherInfos(schema, [current, 'multiple']) === true;

          if (isMultiple) {
            const valueIds = value?.map(media => media.id);
            const newValueIds = newValue?.map(media => media.id);
            if (!isEqual(valueIds, newValueIds)) cleanedValue = newValue;
          } else {
            cleanedValue = value?.id === newValue ? undefined : newValue;
          }
          break;

        case 'relation':
          if (newValue?.disconnect?.length || newValue?.connect?.length)
            cleanedValue = newValue;
          break;

        case 'component':
          if (isRepeatable) {
            cleanedValue = newValue
              ? newValue.map((data, index) => {
                  const subCleanedData = recursiveGetChangedFields(
                    data,
                    (value ?? [])[index],
                    getComponentSchema(component),
                    `${path}.${index}`
                  );

                  return subCleanedData;
                })
              : undefined;
          } else {
            cleanedValue = newValue
              ? recursiveGetChangedFields(
                  newValue,
                  value,
                  getComponentSchema(component),
                  path
                )
              : undefined;
          }

          break;

        default:
          if (!isEqual(value, newValue)) cleanedValue = newValue;
          break;
      }

      const isEmptyValue = cleanedValue === null || cleanedValue === undefined;
      const isEmptyObject = isObject(cleanedValue) && isEmpty(cleanedValue);
      if (isEmptyValue || isEmptyObject) return acc;

      acc[current] = cleanedValue;

      return acc;
    }, {});
  };

  const schema = contentTypes.find(type => type.uid === trail.contentType);

  return recursiveGetChangedFields(trail.content, originalContent, schema, '');
};

export default getTrailChangedFields;
