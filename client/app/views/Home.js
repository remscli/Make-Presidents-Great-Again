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

        this.border = this.$el.find('.home-border');

        this.ready();
      },

      hide: function () {
        var homeTitleEl = this.$el.find('.home__title');
        var homeStarsEl = this.$el.find('.home__stars');
        var homeButtonWrpEl = this.$el.find('.home__button-wrapper');
        var tl = new TimelineMax({onComplete: onTimelineCompleted.bind(this)});

        // Give a fixed height to bars
        $('.home__bars').each(function () {
          $(this).height($(this).height());
        });

        tl.to([homeStarsEl, homeButtonWrpEl], .25, {opacity: 0});
        tl.to([homeStarsEl, homeButtonWrpEl], .3, {width: 0, padding: 0}, .2);
        tl.to([homeTitleEl, '.home__bars'], .3, {height: 0, margin: 0});
        tl.to(['.home'], .3, {width: 200}, '-=0.1');
        tl.to(['.home'], .5, {x: '300%'}, '+=0.3');
        tl.to(this.el, .5, {width: '50%'}, '-=0.5');

        function onTimelineCompleted() {
          this.trigger('hidden');
        }
      }
    });

    return HomeView;
  });
