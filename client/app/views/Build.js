define(['jquery',
        'underscore',
        'backbone',
        'app/views/Page',
        'text!app/templates/build.html'],
        function($,
          _,
          Backbone,
          Page,
          buildTemplate) {

  var BuildView = Page.extend({
    id: 'page-build',

    events: {},

    initialize: function (options) {
      this.template = _.template( buildTemplate );
      this.render();
    },

    render: function () {

      this.$el.html(this.template());

      this.ready();
    }
  });

  return BuildView;
});
