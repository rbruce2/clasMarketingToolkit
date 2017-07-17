var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var siteSchema = new mongoose.Schema({
  url: {
    type: String,
    trim: true,
    required: 'Please enter a site url.'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  links: [String]
});

module.exports = mongoose.model('Site', siteSchema);
