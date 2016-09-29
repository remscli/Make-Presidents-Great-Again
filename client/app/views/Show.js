define(['jquery',
    'underscore',
    'backbone',
    'FlipClock',
    'app/views/Page',
    'app/views/Canvas',
    'app/models/President',
    'text!app/templates/show.html'],
  function ($,
            _,
            Backbone,
            FlipClock,
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
        this.$el.html(this.template({president: this.model}));

        this.canvas = new Canvas({el: "#drawingCanvas"});

        this.model.get('drawingParts').forEach(function (drawingPart) {
          this.canvas.drawImage(drawingPart);
        }, this);

        // Grab the current date
        var currentDate = new Date();
        // Set some date in the past. In this case, it's always been since Jan 1
        var electionDate  = new Date(2016, 11, 8);
        // Calculate the difference in seconds between the future and current date
        var diff = electionDate.getTime() / 1000 - currentDate.getTime() / 1000;

        var countdown = new FlipClock($('#countdown'), diff, {
          clockFace: 'DailyCounter',
          autoStart: true,
          countdown: true
        });

        this.ready();
      }
    });

    return ShowView;
  });
