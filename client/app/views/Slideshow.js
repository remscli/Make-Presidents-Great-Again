define(['jquery',
    'underscore',
    'backbone',
    'TweenMax'],
  function ($,
            _,
            Backbone,
            TweenMax) {

    var SlideshowView = Backbone.View.extend({
      el: '#backgroundSlideshow',

      initialize: function () {
        this.duration = 5; // In seconds
        this.currentIndex = null;
        this.slides = this.$el.find('.bg-slideshow__item');

        this.slideTo(0);

        // Init auto sliding
        this.interval = setInterval(this.changeSlide.bind(this), this.duration * 1000);
      },

      slideTo: function (newIndex) {
        // Show next slide
        $(this.slides[newIndex]).addClass('active');
        TweenMax.to(this.slides[newIndex], 0.8, {opacity: 1, zIndex: -2});
        TweenMax.to(this.slides[newIndex], this.duration * 1.5, {scale: 1.1, ease: Power0.easeNone});

        // Hide current slide
        if (this.currentIndex != null) {
          TweenMax.to(this.slides[this.currentIndex], 0.8, {opacity: 0, zIndex: -3});
          $(this.slides[this.currentIndex]).removeClass('active');

          // Reset previous slide's scale factor to 1
          TweenMax.set(this.slides[this.currentIndex], {scale: 1, delay: 1});
        }

        // Update currentIndex
        this.currentIndex = newIndex;
      },

      changeSlide: function () {
        var index = 0;

        if (this.currentIndex < this.slides.length - 1) {
          index = this.currentIndex + 1;
        }

        this.slideTo(index);
      },

      stopAutoSliding: function () {
        clearInterval(this.interval);
      }
    });

    return SlideshowView;
  });
