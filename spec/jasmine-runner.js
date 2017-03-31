// Taken from http://www.elvenware.com/charlie/development/web/UnitTests/Jasmine.html

var Jasmine = require('jasmine');
var SpecReporter = require('jasmine-spec-reporter').SpecReporter;

var noop = function() {};

var jrunner = new Jasmine();

jrunner.configureDefaultReporter({
   print: noop
}); // remove default reporter logs

jasmine.getEnv().addReporter(new SpecReporter()); // add jasmine-spec-reporter
jrunner.loadConfigFile(); // load jasmine.json configuration
jrunner.execute();