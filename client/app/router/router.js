define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {

  var Router = Backbone.Router.extend({

    /** Routes **/
    routes: {
      '': 'home',
      'build': 'build',
      'p/:token': 'presidentShow',
      'presidents': 'presidentIndex'
    },

    /** Start **/
    start: function() {
      Backbone.history.start({pushState: true});
    },

    /** Routes **/
    home: function() {
      this.trigger('home');
    },

    build: function() {
      this.trigger('build');
    },

    presidentShow: function(token) {
      this.trigger('president:show', token);
    },

    presidentIndex: function() {
      this.trigger('president:index');
    }
  });

  return Router;
});
