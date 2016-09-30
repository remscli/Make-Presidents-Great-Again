var mongoose  = require('mongoose');

var PresidentSchema = mongoose.Schema({
  name: { type: String },
  token: { type: String, index: { unique: true }},
  drawingParts: [{type: String}],
  votes: [{
    ipAddress: {type: String, index: { unique: true }}
  }]
});

module.exports = mongoose.model('President', PresidentSchema);