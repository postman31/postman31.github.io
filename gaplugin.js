(function() {

  // Assign the ga variable to the Google Analytics global function
  var ga = window[window['GoogleAnalyticsObject'] || 'ga'];

  // Helper function for registering the Plugin
  var providePlugin = function(pluginName, pluginConstructor) {
    if (ga) { 
      ga('provide', pluginName, pluginConstructor);
    }
  };
  
  // Constructor for simoPlugin
  // Copies payload to custom host
  var ga2fb = function(tracker) {
    this.tracker = tracker;
    
    // Copy the original hit dispatch function
    var originalSendHitTask = this.tracker.get('sendHitTask');
    
    // Modify the existing hit dispatcher to send a local copy of the hit
    this.tracker.set('sendHitTask', function(model) {
      originalSendHitTask(model); // Send the original hit as usual
      //var xhr = new XMLHttpRequest();
      //xhr.open('POST', 'http://process.simoahava.com/collect', true);
      //xhr.send(model.get('hitPayload'));
      console.log(model.get('hitPayload'));
    });
  };
  
  // Set up a generic event dispatcher
  ga2fb.prototype.trackEvent = function(evt) {
    var c = evt['cat'];
    var a = evt['act'];
    var l = evt['lab'] || undefined;
    var v = evt['val'] || undefined;
    var x = {};
    x['nonInteraction'] = evt['ni'] || false;
    if (evt['di']) {
      x['dimension' + evt['di']] = evt['dv'] || undefined;
    }
    this.tracker.send('event', c, a, l, v, x);
  };
  
  providePlugin('ga2fb', ga2fb); // simoPlugin', SimoPlugin
})();
