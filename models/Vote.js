var mongoose  = require('mongoose');

var VoteSchema = mongoose.Schema({
  voter: {
    ipAddress: {type: String, index: { unique: true }}
  },
  presidentId: { type: mongoose.Schema.Types.ObjectId, ref: 'President'},
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vote', VoteSchema);