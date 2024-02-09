export default function buildPayload(trimmedContent, revisedFields) {
  let changePayloadObj = {};

  if (Object.keys(trimmedContent).length > 0 && revisedFields.length > 0) {
    revisedFields.map(field => {
      if (trimmedContent[field]) {
        changePayloadObj[field] = trimmedContent[field];
      }

      return field;
    });
  }

  return changePayloadObj;
}
