const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
        type: String,
        required: true
      },  
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date,
  companydesc: {
    type: String
  },
  companyname : {
    type: String,
    required: true
  },
  userType : {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Employer', userSchema);
