define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {

  var Router = Backbone.Router.extend({

    /** Routes **/
    routes: {
      '': 'home',
      'build': 'build'
    },

    /** Start **/
    start: function() {
      /** Démarre l'écoute des url **/
      Backbone.history.start({pushState: true});
    },

    /** Routes **/
    home: function() {
      this.trigger('home');
    },

    build: function() {
      this.trigger('build');
    }
  });

  return Router;
});
