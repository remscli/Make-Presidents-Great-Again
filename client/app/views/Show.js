define(['jquery',
    'underscore',
    'backbone',
    'app/views/Page',
    'app/views/Canvas',
    'app/models/President',
    'text!app/templates/show.html'],
  function ($,
            _,
            Backbone,
            Page,
            Canvas,
            President,
            showTemplate) {

    var ShowView = Page.extend({
      id: 'page-show',

      events: {},

      initialize: function (token, options) {
        this.template = _.template(showTemplate);

        this.model = new President({id: token});
        this.model.fetch({success: this.render.bind(this)});
      },

      render: function () {
        this.$el.html(this.template());

        this.canvas = new Canvas({el: "#drawingCanvas"});

        this.model.get('answers').forEach(function (drawingPart) {
          this.canvas.drawImage(drawingPart);
        }, this);


        var permalinkEl = this.$el.find('#permalink')[0];
        permalinkEl.innerText = permalinkEl.href = window.location.href;

        this.ready();
      }
    });

    return ShowView;
  });
