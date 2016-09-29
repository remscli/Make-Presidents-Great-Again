define(['jquery',
    'underscore',
    'backbone'],
  function ($,
            _,
            Backbone) {

    var President = Backbone.Model.extend({
      urlRoot: '/api/presidents',
      defaults: {
        'name': null,
        'token': null,
        'drawingParts': []
      }
    });

    return President;
  });