
/**
 * Module dependencies.
 */

var integration = require('analytics.js-integration');
var load = require('load-script');
var bind = require('bind');
var when = require('when');
var is = require('is');

/**
 * Expose plugin.
 */

module.exports = exports = function(analytics){
  analytics.addIntegration(Mojn);
};

/**
 * Expose `Mojn`
 */

var Mojn = exports.Integration = integration('Mojn')
  .readyOnLoad()
  .option('customerCode', '')
  .global('_mojnTrack');

/**
 * Initialize.
 *
 * @param {Object} page
 */

Mojn.prototype.initialize = function(){
  window._mojnTrack = window._mojnTrack || [];
  window._mojnTrack.push({ cid: this.options.customerCode });
  this.load();
};

/**
 * Load the Mojn script.
 *
 * @param {Function} fn
 */

Mojn.prototype.load = function(fn){
  var loaded = bind(this, this.loaded);
  load('https://track.idtargeting.com/' + this.options.customerCode + '/track.js', function(){
    when(loaded, fn);
  });
};

/**
 * Loaded?
 *
 * @return {Boolean}
 */

Mojn.prototype.loaded = function(){
  return is.object(window._mojnTrack);
};

/**
 * Identify.
 *
 * @param {Identify} identify
 */

Mojn.prototype.identify = function(identify){
  var email = identify.email();
  if (!email) return;
  var img = new Image();
  img.src = '//matcher.idtargeting.com/analytics.gif?cid=' + this.options.customerCode + '&_mjnctid='+email;
  img.width = 1;
  img.height = 1;
  return img;
};

/**
 * Track.
 *
 * @param {Track} event
 */

Mojn.prototype.track = function(track){
  var properties = track.properties();
  var revenue = properties.revenue;
  var currency = properties.currency || '';
  var conv = currency + revenue;
  if (!revenue) return;
  window._mojnTrack.push({ conv: conv });
  return conv;
};
