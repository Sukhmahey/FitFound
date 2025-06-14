const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InteractionSchema = new Schema({
    candidateId: { type: Schema.Types.ObjectId, ref: 'candidates' }, // to get the id from the candidates collection
    employerId: { type: Schema.Types.ObjectId, ref: 'users' },
    jobId: { type: Schema.Types.ObjectId, ref: 'jobs' },
    sourceJobFormId: { type: Schema.Types.ObjectId, ref: 'jobs' }, // is this the same jobId???
    shortlisted: { type: Boolean, default: false },
    outreachMessage: { type: String, minLength: 12, maxLength: 300 },
    interview: {
        status: {
            type: String,
            enum: ['none', 'pending', 'scheduled', 'completed']
        },
        method: {
            type: String,
            enum: ['phone', 'video', 'in-person']
        },
        dateTime: {
            type: Date,
            default: Date.now
        }
    },
    finalStatus: {
        type: String,
        enum: ['none', 'hired', 'rejected']
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
}, {collection: 'interactions'});

InteractionSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.createdAt = this.createdAt;
  }
  next();
});

const Interaction = mongoose.model('Interaction', InteractionSchema);
module.exports = Interaction;