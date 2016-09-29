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
        this.titleEl = this.$el.find('.home__title');
        this.starsEl = this.$el.find('.home__stars');
        this.barsEls = this.$el.find('.home__bars');

        this.ready();
      },

      shown: function () {
        var tl = new TimelineMax({onComplete: function () {
          $('.home').addClass('home--shown');
        }});
        tl.fromTo(this.starsEl, .3, {opacity: 0, y: 20}, {opacity: 1, y: 0}, .8);
        tl.fromTo(this.titleEl, .3, {opacity: 0, y: 20}, {opacity: 1, y: 0});
        tl.fromTo('.home__button', .3, {opacity: 0, y: 20}, {opacity: 1, y: 0});
      },

      hide: function () {
        var homeButtonWrpEl = this.$el.find('.home__button-wrapper');
        var tl = new TimelineMax({onComplete: onTimelineCompleted.bind(this)});

        // Give a fixed height to bars
        this.barsEls.each(function () {
          $(this).height($(this).height());
        });

        tl.to('.home-border', .25, {opacity: 0});
        tl.to([this.starsEl, homeButtonWrpEl], .25, {opacity: 0}, 0);
        tl.to([this.starsEl, homeButtonWrpEl], .3, {width: 0, padding: 0}, '-=0.05');
        tl.to([this.titleEl, this.barsEls], .3, {height: 0, margin: 0});
        tl.to(['.home'], .3, {width: '50%'}, '-=0.1');

        function onTimelineCompleted() {
          this.trigger('hidden');
        }
      }
    });

    return HomeView;
  });
