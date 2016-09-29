define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {

  var Router = Backbone.Router.extend({

    /** Routes **/
    routes: {
      '': 'home',
      'build': 'build',
      'p/:token': 'show'
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

    show: function(token) {
      this.trigger('show', token);
    }
  });

  return Router;
});
