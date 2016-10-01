define(['jquery',
    'underscore',
    'backbone',
    'app/views/Page',
    'app/collections/Presidents',
    'text!app/templates/president-index.html'],
  function ($,
            _,
            Backbone,
            Page,
            Presidents,
            presidentIndexTemplate) {

    var PresidentIndexView = Page.extend({
      id: 'page-president-index',

      events: {},

      initialize: function (options) {
        this.template = _.template(presidentIndexTemplate);

        this.model = new Presidents();
        this.model.fetch({
          success: this.render.bind(this)
        });
      },

      render: function () {
        this.$el.html(this.template({
          podiumPresidents: this.model.models.filter(function(el, i) { return i < 3}),
          otherPresidents: this.model.models.filter(function(el, i) { return i >= 3})
        }));

        this.ready();
      }
    });

    return PresidentIndexView;
  });
