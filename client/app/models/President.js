define(['jquery',
    'underscore',
    'backbone'],
  function ($,
            _,
            Backbone) {

    var President = Backbone.Model.extend({
      url: '/api/presidents',
      defaults: {
        'name': null,
        'token': null,
        'answers': []
      }
    });

    return President;
  });