var assert = require('assert');
var glob = require('glob');
var iso3166 = require('iso-3166-2');
var matter = require('gray-matter');
var path = require('path');
var schema = require('node-verifier-schema');
var util = require('util');
var validator = require('validator');

var Rule = schema.Verifier.Rule;

Rule.add('country', Rule.extend({
    check: function (value, params, done) {
        if (typeof value === 'string' && 'name' in iso3166.country(value)) {
            done(null, true);
        } else {
            done(new Error('Invalid country code.'), false);
        }
    }
}));

Rule.add('url', Rule.extend({
    check: function (value, params, done) {
        if (typeof value === 'string' && validator.isURL(value, { protocols: ['http', 'https'] })) {
            done(null, true);
        } else {
            done(new Error('Invalid URL.'), false);
        }
    }
}));

Rule.add('nullable_boolean', Rule.extend({
    check: function (value, params, done) {
        if (value === null || value === true || value === false) {
            done(null, true);
        } else {
            done(new Error('Invalid boolean value.'), false);
        }
    }
}));


var verifier = schema.create().object(function () {
  this.required('name', ['type string']);
  this.required('website', ['url']);
  this.required('vendor').object(function () {
    this.optional('country', ['country']);
    this.optional('employees', ['type number']);
    this.optional('founded', ['type number']);
    this.optional('name', ['type string']);
    this.optional('website', ['url']);
  });
  this.required('features').object(function () {
    this.optional('api', ['nullable_boolean']);
    this.optional('booth_rental', ['nullable_boolean']);
    this.optional('clients', ['nullable_boolean']);
    this.optional('marketing', ['nullable_boolean']);
    this.optional('employees', ['nullable_boolean']);
    this.optional('inventory', ['nullable_boolean']);
    this.optional('loyalty_program', ['nullable_boolean']);
    this.optional('multi_location', ['nullable_boolean']);
    this.optional('multi_user', ['nullable_boolean']);
    this.optional('online_booking', ['nullable_boolean']);
    this.optional('recurring', ['nullable_boolean']);
    this.optional('reminders', ['nullable_boolean']);
    this.optional('resources', ['nullable_boolean']);
    this.optional('scheduling', ['nullable_boolean']);
    this.optional('payroll', ['nullable_boolean']);
    this.optional('pos', ['nullable_boolean']);
  });
  this.required('deployment').object(function () {
    this.optional('web', ['nullable_boolean']);
    this.optional('mobile', ['nullable_boolean']);
    this.optional('installed', ['nullable_boolean']);
  });
  this.optional('free_trial', ['nullable_boolean']);
  this.optional('pricing', ['type string']);
}).verifier();

var files = glob.sync('../data/*.md', { cwd: __dirname, realpath: true });
files.forEach(function (file) {
  describe(path.basename(file), function () {
    it('should be valid', function (done) {
      var contents = matter.read(file);
      verifier.verify(contents.data, function (err) {
        if(err instanceof schema.ValidationError) {
          done(new Error(util.format('The rule "%s" did fail (path: %s).', err.rule, err.path.join('.'))));
        } else {
          done(err);
        }
      });
    });
  });
});
