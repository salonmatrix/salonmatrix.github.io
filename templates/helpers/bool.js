'use strict';

module.exports.register = function (Handlebars, options, params) {
  Handlebars.registerHelper('bool', function (value, options) {
    if(value === true || value === false) {
      return options.fn(this);
    }
    return options.inverse(this);
  });
};
