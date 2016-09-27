define(['jquery',
    'underscore',
    'backbone',
    'pixi'],
  function ($,
            _,
            Backbone,
            PIXI) {

    var CanvasView = Backbone.View.extend({

      initialize: function () {
        this.width = this.$el.width();
        this.height = this.$el.height();

        // Create the renderer
        this.renderer = PIXI.autoDetectRenderer(this.width, this.height, {transparent: true});

        // Add the canvas to the HTML document
        this.el.appendChild(this.renderer.view);

        // Create a container object
        this.stage = new PIXI.Container();

        // Tell the renderer to render the stage
        this.renderer.render(this.stage);
      }

    });

    return CanvasView;
  });
