define(['jquery',
    'underscore',
    'backbone'],
  function ($,
            _,
            Backbone) {

    var PageView = Backbone.View.extend({
      tagName: 'section',
      className: 'page',

      initialize: function () {
        this.isReady = false;
        this.render();
      },

      hide: function () {
        this.trigger('hidden');
      },

      ready: function () {
        this.isReady = true;
        this.trigger('ready');
      },

      added: function () {
        // After add callback
      },

      shown: function () {
        // After show callback
      },

      render: function () {
        this.$el.html(this.template);

        this.ready();
      },

      destroy: function () {
        this.undelegateEvents();
        this.$el.removeData().unbind();

        this.remove();
        Backbone.View.prototype.remove.call(this);
      }

    });

    return PageView;
  });
