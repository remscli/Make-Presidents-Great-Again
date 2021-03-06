define(['jquery',
    'underscore',
    'backbone',
    'FlipClock',
    'app/views/Page',
    'app/views/Canvas',
    'app/models/President',
    'text!app/templates/president-show.html'],
  function ($,
            _,
            Backbone,
            FlipClock,
            Page,
            Canvas,
            President,
            presidentShowTemplate) {

    var PresidentShowView = Page.extend({
      id: 'page-president-show',

      events: {
        'click #voteButton': 'onVoteButtonClicked'
      },

      initialize: function (token, options) {
        this.template = _.template(presidentShowTemplate);

        this.model = new President({id: token});
        this.model.fetch({
          success: this.render.bind(this),
          error: function () {
            Backbone.history.navigate('/', {
              trigger: true,
              replace: false
            });
          }
        });
      },

      render: function () {
        this.$el.html(this.template({president: this.model}));

        this.canvas = new Canvas({el: "#drawingCanvas"});

        this.model.get('drawingParts').forEach(function (drawingPart) {
          this.canvas.draw(drawingPart);
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
      },

      shown: function () {
        var overlay = $('#animationOverlay')[0];
        var overlayPos = overlay.getBoundingClientRect();

        var canvas = $('#drawingCanvas')[0];
        var canvasPos = canvas.getBoundingClientRect();

        var tl = new TimelineMax();
        tl.to(overlay, .9, {
          x: canvasPos.left - overlayPos.left,
          y: canvasPos.top - overlayPos.top,
          scaleX: canvasPos.width / overlayPos.width,
          scaleY: canvasPos.height / overlayPos.height,
          ease: Power3.easeInOut
        });
        tl.to(overlay, .3, {opacity: 0});
        tl.set(overlay, {display: 'none'});
      },

      onVoteButtonClicked: function () {
        $.ajax({
          type: "POST",
          url: '/api/presidents/' + this.model.get('token') + '/vote'
        }).done(function (res) {
          $('.pr-show__vote-backface').addClass('btn--success').text('Voted !');
        }).fail(function (res) {
          $('.pr-show__vote-backface').addClass('btn--danger').text('You have already voted :(');
        }).always(function () {
          $('.pr-show__vote-wrapper').addClass('has-voted');
        });
      }
    });

    return PresidentShowView;
  });
