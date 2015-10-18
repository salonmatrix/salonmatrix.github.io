'use strict';

module.exports.register = function (Handlebars, options, params) {
  Handlebars.registerHelper('feature_str', function (data, key, yes, no, unknown, options) {
    if(data[key] === true) {
      return new Handlebars.SafeString('<span title="Yes" class="feature-yes">' + yes + '</span>');
    }else if(data[key] === false) {
      return new Handlebars.SafeString('<span title="No" class="feature-no">' + no + '</span>');
    }else{
      return new Handlebars.SafeString('<span title="Unknown" class="feature-unknown">' + unknown + '</span>');
    }
  });
};
