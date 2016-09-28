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
        this.originalSceneSize = 1400;
        this.width = this.$el.width();
        this.height = this.$el.height();

        this.scaleFactor = (this.width > this.height ? this.height : this.width) / this.originalSceneSize;
        this.offsetX = (this.width - (this.originalSceneSize * this.scaleFactor)) / 2;
        this.offsetY = (this.height - (this.originalSceneSize * this.scaleFactor)) / 2;

        // Create the renderer
        this.renderer = PIXI.autoDetectRenderer(this.width, this.height, {transparent: true, resolution: window.devicePixelRatio});

        // Add the canvas to the HTML document
        this.el.appendChild(this.renderer.view);

        $(this.renderer.view).height(this.height);
        $(this.renderer.view).width(this.width);

        // Create a container object
        this.stage = new PIXI.Container();

        this.update();
      },

      update: function () {
        this.renderer.render(this.stage);
      },

      drawImage: function (imagePath, originalPos) {
        PIXI.loader.add(imagePath).load(imageHasLoaded.bind(this));

        function imageHasLoaded() {
          var image = new PIXI.Sprite( PIXI.loader.resources[imagePath].texture );

          image.width = image.width * this.scaleFactor;
          image.height = image.height * this.scaleFactor;
          image.position.x = this.offsetX + (originalPos.x * this.scaleFactor);
          image.position.y = this.offsetY + (originalPos.y * this.scaleFactor);

          this.stage.addChild(image);

          this.update();
        }
      }
    });

    return CanvasView;
  });
