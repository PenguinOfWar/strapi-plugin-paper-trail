module.exports = string => {
  const regex = /\/api\/[a-zA-Z0-9-](?:\/\d*)?/;
  return string.match(regex);
};
