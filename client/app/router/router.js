define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {

  var Router = Backbone.Router.extend({

    /** Routes **/
    routes: {
      '': 'home',
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
  });

  return Router;
});
