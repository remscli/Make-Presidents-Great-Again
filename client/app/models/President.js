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
        'drawingParts': [],
        'drawing': null
      },
      sync: function(method, model, options){

        // Post data as FormData object on create to allow file upload
        if(method == 'create'){
          var formData = new FormData();

          // Loop over model attributes and append to formData
          _.each(model.attributes, function(value, key){
            formData.append(key, value);
          });

          // Set processData and contentType to false so data is sent as FormData
          _.defaults(options || (options = {}), {
            data: formData,
            processData: false,
            contentType: false
          });
        }
        return Backbone.sync.call(this, method, model, options);
      }
    });

    return President;
  });