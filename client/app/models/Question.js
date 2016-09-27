define(['jquery',
    'underscore',
    'backbone'],
  function($,
           _,
           Backbone){

    var Question = Backbone.Model.extend({
      defaults: {
        'questionBody': null,
        'negativeAnswer': null,
        'positiveAnswer': null
      }
    });

    return Question;
  });