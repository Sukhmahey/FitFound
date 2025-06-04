const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+/;
const pohneRegex = /^\+1\s\(\d{3}\)\s\d{3}-\d{4}/; //format: +1 (601) 351-4587

const UserSchema = new Schema( {
    name: { type: String, required: true, minLength: 5, maxLength: 60 },
    email: {
        type: String,
        required: [true, 'User email is required'],
        match: [emailRegex, 'Please provide a valid email address']
    },
    phone: {
        type: String,
        match: [pohneRegex, 'Please provide a valid phone number']
    },
    role: { 
        type: String, required: true,
        enum: ['candidate', 'employer']
    },
    isEligibleToWork:  { type: Boolean, default: false },
    personalSummary: { type: String, minLength: 50, maxLength: 600 },
    companyName: {
        type: String, minLength: 5, maxLength: 60,
        required: [function() {
            return this.role === 'employer';
        }, 
        'Please provide a Company Name']
    },
    companyDescription: {
        type: String, minLength: 50, maxLength: 600,
        required: [function() {
            return this.role === 'employer';
        }, 
        'Please provide a Company Description']
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { collection: 'users' });

UserSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.createdAt = this.createdAt;
  }
  next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;