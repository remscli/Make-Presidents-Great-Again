define(['jquery',
        'underscore',
        'backbone',
        'app/models/Circle',
        'app/config'],
        function($,
          _,
          Backbone,
          Circle,
          config){

  var Circles = Backbone.Collection.extend({
  	model: Circle,
  	url: config.apiRoot + 'circles',
    sync: function(method, model, options) {
      options.beforeSend = function(xhr) {
        return xhr.setRequestHeader('x-access-token', window.localStorage.getItem("comoAuthToken"));
      };
      return Backbone.sync.call(this, method, model, options);
    }
  });

  return Circles;

});
