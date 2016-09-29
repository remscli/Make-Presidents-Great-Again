var mongoose  = require('mongoose');
var randtoken = require('rand-token');

var PresidentSchema = mongoose.Schema({
  name: { type: String },
  token: { type: String, default: randtoken.generate(12), index: { unique: true }},
  drawingParts: [{type: String}]
});

module.exports = mongoose.model('President', PresidentSchema);