
var callback    = require('callback');
var integration = require('analytics.js-integration');
var load        = require('load-script');
var push        = require('global-queue')('_attrq');

/**
 * Expose plugin.
 */

module.exports = exports = function(analytics){
  analytics.addIntegration(Attribution);
};

/**
 * Expose `Attribution IO` integration.
 */

var Attribution = exports.Integration = integration('Attribution')
  .readyOnInitialize()
  .global('_attrq')
  .option('projectId', '')

/**
 * Initialize.
 *
 */

Attribution.prototype.initialize = function(){
  window.Attribution = window.Attribution || {};
  this.load();
};

/**
 * Load the Attribution library.
 *
 * @param {Function} callback
 */

Attribution.prototype.load = function(callback){
  load('//localhost:9000/scripts/attribution.js', callback);
};

/**
 * Page.
 *
 * @param {Page} page
 */

Attribution.prototype.page = function(page){
  this.track(page.track());
};

/**
 * Track.
 *
 * @param {Track} track
 */

Attribution.prototype.track = function(track) {
  push('track', track.properties());
}
