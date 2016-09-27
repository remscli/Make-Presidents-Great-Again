define(['jquery',
    'underscore',
    'backbone',
    'app/views/Page',
    'text!app/templates/home.html'],
  function ($,
            _,
            Backbone,
            Page,
            homeTemplate) {

    var HomeView = Page.extend({
      id: 'page-home',

      events: {},

      initialize: function (options) {
        this.template = _.template(homeTemplate);
        this.render();
      },

      render: function () {

        this.$el.html(this.template());

        this.ready();
      }
    });

    return HomeView;
  });
