import { Schema, model } from 'mongoose';

const passdownEmailSchema = new Schema({
  shiftLog: {
    type: Schema.Types.ObjectId,
    ref: 'ShiftLog',
    required: true,
  },
  sentBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  managerEmail: {
    type: String,
    required: true,
    match: [/.+@.+\..+/, 'Must match an email address!'],
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    maxlength: 2000,
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending',
  },
  sentAt: {
    type: Date,
  },
  errorMessage: {
    type: String,
  },
}, {
  timestamps: true,
});

const PassdownEmail = model('PassdownEmail', passdownEmailSchema);

export default PassdownEmail;