define(['jquery',
        'underscore',
        'backbone',
        'app/models/President'],
        function($,
          _,
          Backbone,
          President){

  var Presidents = Backbone.Collection.extend({
  	model: President,
  	url: '/api/presidents'
  });

  return Presidents;

});
