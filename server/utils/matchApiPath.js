module.exports = string => {
  const regex = /\/api\/test-content-types(?:\/\d*)?/;
  return string.match(regex);
};
