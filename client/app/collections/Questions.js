define(['jquery',
        'underscore',
        'backbone',
        'app/models/Question'],
        function($,
          _,
          Backbone,
          Question){

  var Questions = Backbone.Collection.extend({
  	model: Question,
  	url: 'app/datas/questions.json',
  });

  return Questions;

});
