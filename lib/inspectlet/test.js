
var Analytics = require('analytics.js').constructor;
var integration = require('analytics.js-integration');
var tester = require('analytics.js-integration-tester');
var plugin = require('./');

describe('Inspectlet', function(){
  var Inspectlet = plugin.Integration;
  var inspectlet;
  var analytics;
  var options = {
    wid: 'x'
  };

  beforeEach(function(){
    analytics = new Analytics;
    inspectlet = new Inspectlet(options);
    analytics.use(plugin);
    analytics.use(tester);
    analytics.add(inspectlet);
  });

  afterEach(function(){
    analytics.restore();
    analytics.reset();
  });

  after(function(){
    inspectlet.reset();
    XMLHttpRequest.prototype.open = open; // inspectlet clobbers it
  });

  it('should have the right settings', function(){
    analytics.compare(Inspectlet, integration('Inspectlet')
      .assumesPageview()
      .readyOnLoad()
      .global('__insp')
      .global('__insp_')
      .option('wid', ''));
  });

  describe('before loading', function(){
    beforeEach(function(){
      analytics.stub(inspectlet, 'load');
    });

    afterEach(function(){
      inspectlet.reset();
    });

    describe('#initialize', function(){
      it('should create the inspectlet queue', function(){
        analytics.assert(!window.__insp);
        analytics.initialize();
        analytics.page();
        analytics.assert(window.__insp);
      });

      it('should push the wid', function(){
        analytics.initialize();
        analytics.page();
        analytics.deepEqual(window.__insp, [['wid', options.wid]]);
      });

      it('should call #load', function(){
        analytics.initialize();
        analytics.page();
        analytics.called(inspectlet.load);
      });
    });
  });

  describe('loading', function(){
    it('should load', function(done){
      analytics.load(inspectlet, done);
    });
  });

  describe('after loading', function(){
    beforeEach(function(done){
      analytics.once('ready', done);
      analytics.initialize();
      analytics.page();
    });

    describe('#identify', function(){
      beforeEach(function(){
        analytics.stub(window.__insp, 'push');
      });

      it('should identify the user', function(){
        analytics.identify('userId', { email: 'email@example.com' });
        analytics.called(window.__insp.push, ['tagSession', {
          email: 'email@example.com',
          userid: 'userId'
        }]);
      });
    });

    describe('#track', function(){
      beforeEach(function(){
        analytics.stub(window.__insp, 'push');
      });

      it('should tag the session', function(){
        analytics.track('event');
        analytics.called(window.__insp.push, ['tagSession', 'event']);
      });
    });
  });
});