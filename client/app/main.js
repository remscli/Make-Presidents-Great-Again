requirejs.config({
  baseUrl: './',
  paths: {
    text: 'lib/text',
    underscore: 'lib/underscore.min',
    jquery: 'lib/jquery.min',
    backbone: 'lib/backbone.min',
    TweenMax: 'lib/TweenMax',
    pixi: 'lib/pixi',
    app: 'app'
  },
  shim: {
    underscore: {
      exports: '_'
    },
    jquery: {
      exports: '$'
    },
    pixi: {
      exports: 'PIXI'
    },
    TweenMax: {
      exports: 'TweenMax'
    },
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    }
  }
});

requirejs(['jquery', 'app/views/App'], function ($, App) {
  var app = new App();
});
