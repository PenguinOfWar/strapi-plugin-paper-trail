module.exports = string => {
  const regex =
    /\/content-manager\/collection-types\/([a-zA-Z0-9-]+::[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+)(?:\/\d*)?/;
  return string.match(regex);
};
