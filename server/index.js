'use strict';

const bootstrap = require('./bootstrap');
const config = require('./config');
const contentTypes = require('./content-types');
const controllers = require('./controllers');
const destroy = require('./destroy');
const middlewares = require('./middlewares');
const register = require('./register');
const routes = require('./routes');
const services = require('./services');

module.exports = {
  register,
  bootstrap,
  destroy,
  config,
  controllers,
  routes,
  services,
  contentTypes,
  middlewares
};
