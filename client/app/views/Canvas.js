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
        this.imagesFileNames = [];

        this.measure();

        // Create the renderer
        this.renderer = PIXI.autoDetectRenderer(this.width, this.height, {
          transparent: false,
          resolution: window.devicePixelRatio,
          preserveDrawingBuffer: true
        });
        this.renderer.backgroundColor = 0xFFFFFF;

        // Add the canvas to the HTML document
        this.el.appendChild(this.renderer.view);

        this.sizer();

        // Create a container object
        this.stage = new PIXI.Container();

        this.update();

        // Ask for images positions
        $.ajax({
          type: "GET",
          url: 'app/datas/drawing-parts.json'
        }).done(drawingPartsLoaded.bind(this));

        function drawingPartsLoaded (drawingParts) {
          this.drawingParts = drawingParts;
        }

        $( window ).resize(onResize.bind(this));
        function onResize() {
          this.clear();
          this.measure();
          this.sizer();

          this.imagesFileNames.forEach(function (imageFileName) {
            this.drawImage(imageFileName);
          }, this);
        }
      },

      update: function () {
        this.renderer.render(this.stage);
      },

      measure: function () {
        this.width = this.$el.width();
        this.height = this.$el.height();

        this.scaleFactor = (this.width > this.height ? this.height : this.width) / this.originalSceneSize;
        this.offsetX = (this.width - (this.originalSceneSize * this.scaleFactor)) / 2;
        this.offsetY = (this.height - (this.originalSceneSize * this.scaleFactor)) / 2;
      },

      sizer: function () {
        $(this.renderer.view).height(this.height);
        $(this.renderer.view).width(this.width);
      },

      clear: function () {
        while (this.stage.children[0]) {
          this.stage.removeChild(this.stage.children[0]);
        }
        this.update();
      },

      draw: function (imageFileName) {
        this.imagesFileNames.push(imageFileName);
        this.drawImage(imageFileName);
      },

      drawImage: function (imageFileName) {
        var imagePath = this.getImagePath(imageFileName);
        if (PIXI.loader.resources[imagePath]) {
          imageHasLoaded.call(this);
        } else {
          PIXI.loader.add(imagePath).load(imageHasLoaded.bind(this));
        }

        function imageHasLoaded() {
          // Retrieve image position
          var position = _.find(this.drawingParts, function (drawingPart) {
            return drawingPart.fileName == imageFileName
          });

          if (!position) return;

          var image = new PIXI.Sprite( PIXI.loader.resources[imagePath].texture );

          image.width = image.width * this.scaleFactor;
          image.height = image.height * this.scaleFactor;
          image.position.x = this.offsetX + (position.x * this.scaleFactor);
          image.position.y = this.offsetY + (position.y * this.scaleFactor);
          image.z = position.z;

          this.stage.addChild(image);

          function depthCompare(a, b) {
            if (a.z < b.z) return -1;
            if (a.z > b.z) return 1;
            return 0;
          }

          this.stage.children.sort(depthCompare);

          this.update();
        }
      },

      getImagePath: function (imageFileName) {
        return 'img/' + imageFileName + '.png';
      },

      getDataURL: function () {
        return this.renderer.view.toDataURL("image/jpeg", 0.6);
      }
    });

    return CanvasView;
  });
