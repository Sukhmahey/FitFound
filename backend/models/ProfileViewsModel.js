const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileViewsSchema = new Schema({
    candidateId: { type: Schema.Types.ObjectId, ref: 'candidates' },
    employerId: { type: Schema.Types.ObjectId, ref: 'users' },
    lastViewedAt: { type: Date, default: Date.now } 
}, { collection: 'profile_views'});

ProfileViewsSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.createdAt = this.createdAt;
  }
  next();
});

const ProfileViews = mongoose.model('ProfileViews', ProfileViewsSchema);
module.exports = ProfileViews;