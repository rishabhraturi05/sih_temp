import mongoose from 'mongoose';

const MentorApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'User ID is required'],
      ref: 'User',
      unique: true,
      index: true
    },
    mentorIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mentor'
    }]
  },
  {
    timestamps: true,
    collection: 'mentorapplications'
  }
);

// Ensure mentorIds array doesn't have duplicates
MentorApplicationSchema.methods.addMentor = function(mentorId) {
  if (!this.mentorIds.includes(mentorId)) {
    this.mentorIds.push(mentorId);
  }
  return this.save();
};

export default mongoose.models.MentorApplication || mongoose.model('MentorApplication', MentorApplicationSchema);

