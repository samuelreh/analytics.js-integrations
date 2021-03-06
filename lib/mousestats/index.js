
/**
 * Module dependencies.
 */

var integration = require('analytics.js-integration');
var load = require('load-script');
var each = require('each');
var is = require('is');

/**
 * Expose plugin.
 */

module.exports = exports = function(analytics){
  analytics.addIntegration(MouseStats);
};

/**
 * Expose `MouseStats` integration.
 */

var MouseStats = exports.Integration = integration('MouseStats')
  .assumesPageview()
  .readyOnLoad()
  .global('msaa')
  .global('MouseStatsVisitorPlaybacks')
  .option('accountNumber', '');

/**
 * Initialize.
 *
 * http://www.mousestats.com/docs/pages/allpages
 *
 * @param {Object} page
 */

MouseStats.prototype.initialize = function(page){
  this.load();
};

/**
 * Loaded?
 *
 * @return {Boolean}
 */

MouseStats.prototype.loaded = function(){
  return is.array(window.MouseStatsVisitorPlaybacks);
};

/**
 * Load.
 *
 * @param {Function} callback
 */

MouseStats.prototype.load = function(callback){
  var number = this.options.accountNumber;
  var path = number.slice(0,1) + '/' + number.slice(1,2) + '/' + number;
  var cache = Math.floor(new Date().getTime() / 60000);
  var partial = '.mousestats.com/js/' + path + '.js?' + cache;
  var http = 'http://www2' + partial;
  var https = 'https://ssl' + partial;
  load({ http: http, https: https }, callback);
};

/**
 * Identify.
 *
 * http://www.mousestats.com/docs/wiki/7/how-to-add-custom-data-to-visitor-playbacks
 *
 * @param {Identify} identify
 */

MouseStats.prototype.identify = function(identify){
  each(identify.traits(), function (key, value) {
    window.MouseStatsVisitorPlaybacks.customVariable(key, value);
  });
};
