'use strict';

var iso3166 = require('iso-3166-2');

module.exports.register = function (Handlebars, options, params) {
  Handlebars.registerHelper('country', function (code) {
    var data = iso3166.country(code);
    if('name' in data) {
      return data.name;
    } else {
      return '';
    }
  });
};
