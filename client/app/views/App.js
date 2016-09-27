define(['jquery',
    'underscore',
    'backbone',
    'app/router/router',
    'app/views/Home',
    'app/views/Build',
    'app/views/Slideshow'],
  function ($,
            _,
            Backbone,
            Router,
            HomeView,
            BuildView,
            SlideshowView) {

    var App = Backbone.View.extend({
      el: 'body',
      events: {
        'click a[nav-link]': 'navigate'
      },

      initialize: function () {

        this.currentPage = null;
        this.hidden = true;

        this.container = this.$("#main");
        this.slideshow = new SlideshowView();

        this.router = new Router();

        this.registerEvents();
      },

      registerEvents: function () {
        // Listening router's events

        // Home
        this.listenTo(this.router, 'home', this.goHome);

        // Build
        this.listenTo(this.router, 'build', this.goBuild);

        this.router.start();
      },

      /**
       * Page Navigation
       */

      goHome: function () {
        this.goTo(null, {
          url: '/',
          routerParams: {
            replace: false,
            trigger: false
          },
          method: function () {
            this.currentPage = new HomeView();
          }
        });
      },

      goBuild: function () {
        this.slideshow.stopAutoSliding();
        this.goTo(null, {
          url: '/build',
          method: function () {
            this.currentPage = new BuildView();
          }
        });
      },

      goTo: function (params, options) {
        // If page isn't hidden, we kill it
        if (!this.hidden) {
          this.hide(this.goTo, params, options);
          return;
        } else {
          this.kill();
        }

        // Execute route specific method
        options.method.call(this, params);

        this.listenTo(this.currentPage, "changePage", this.handlePageChange);

        // Change url with router's params if needed
        if (options.url && options.routerParams) {
          this.router.navigate(options.url, options.routerParams);
        }

        // Add page
        this.add();
      },

      handlePageChange: function (dest, params) {
        this[dest](params);
      },

      navigate: function (e) {
        e.preventDefault();
        e.stopPropagation();

        Backbone.history.navigate($(e.currentTarget).attr('href'), {
          trigger: true
        });

        $('a').removeClass('active');
        $('a[href="/' + Backbone.history.fragment + '"]').addClass('active');
      },

      /**
       * Page Management
       */

      kill: function () {
        console.log("APP:KILL", this.currentPage);

        if (this.currentPage) {

          // Stop listening hidden events
          this.stopListening(this.currentPage);

          // Kill page
          this.currentPage.destroy();
        }
      },

      add: function () {
        console.log("APP:ADD", this.currentPage);

        // Add new page to DOM
        this.container.prepend(this.currentPage.el);

        // Send added callback
        this.currentPage.added();

        // When page is ready, we display it
        if (!this.currentPage.isReady) {
          this.listenTo(this.currentPage, 'ready', this.show);
        } else {
          this.show();
        }
      },

      show: function () {
        console.log('APP:SHOW', this.currentPage);

        this.currentPage.shown();

        // Stop listening ready events
        //this.stopListening(this.currentPage);

        // Show page
        this.hidden = false;
      },

      hide: function (method, params, options) {
        console.log('APP:HIDE', this.currentPage);

        // Hide page
        this.hidden = true;

        // Check if page exist
        if (this.currentPage) {

          // Stop listening page events
          this.stopListening(this.currentPage);

          // When page is hidden, we call back the method
          this.listenTo(this.currentPage, 'hidden', method.bind(this, params, options));
          this.currentPage.hide();

        } else {
          method.bind(this, params, options);
        }
      }
    });

    return App;
  });
