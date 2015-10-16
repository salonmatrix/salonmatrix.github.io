var assert = require('assert');
var glob = require('glob');
var matter = require('gray-matter');
var path = require('path');
var schema = require('node-verifier-schema');
var util = require('util');

var verifier = schema.create().object(function () {
  this.field('name');
  this.field('website');
  this.field('vendor');
  this.field('vendor_website').optional();
  this.field('features').object(function () {
    this.field('api').optional();
    this.field('clients').optional();
    this.field('employees').optional();
    this.field('inventory').optional();
    this.field('multi_location').optional();
    this.field('multi_user').optional();
    this.field('online_booking').optional();
    this.field('reminders').optional();
    this.field('resources').optional();
    this.field('scheduling').optional();
    this.field('payroll').optional();
    this.field('pos').optional();
  });
  this.field('deployment').object(function () {
    this.field('web').optional();
    this.field('installed').optional();
  });
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
