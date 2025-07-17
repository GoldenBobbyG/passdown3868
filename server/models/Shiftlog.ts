import { Schema, model }  from 'mongoose';

// this commit yardDataSchema defines the structure of the yard data
const yardDataSchema = new Schema({
  storeLDO: { type: Number, default: 0 },
  ibFreight: { type: Number, default: 0 },
  emptyTarget: { type: Number, default: 0 },
  emptyOTR: { type: Number, default: 0 },
  emptyFulfillment: { type: Number, default: 0 },
  ldoFulfillment: { type: Number, default: 0 },
  udcTrailers: { type: Number, default: 0 },
  osvPM: { type: Number, default: 0 },
  emptyIBT: { type: Number, default: 0 },
  loadedIBT: { type: Number, default: 0 },
  goodPallet: { type: Number, default: 0 },
  badWoodPallet: { type: Number, default: 0 },
  csvPOD: { type: Number, default: 0 },
  sweep: { type: Number, default: 0 },
  udcSweeps: { type: Number, default: 0 },
  rejectedFreight: { type: Number, default: 0 },
});

const lateDepartureSchema = new Schema({
  loadId: { type: String, required: true },
  store: { type: String, required: true },
  trailer: { type: String, required: true },
  critical: { type: String, required: true },
  actual: { type: String, required: true },
  reason: { type: String, required: true },
});

const ycRoutinesSchema = new Schema({
  departureEmails: { type: Boolean, default: false },
  nearMiss: { type: Boolean, default: false },
  audit: { type: Boolean, default: false },
  bols: { type: Boolean, default: false },
  emptyEmails: { type: Boolean, default: false },
});

const shiftLogSchema = new Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  shift: {
    type: String,
    required: true,
    enum: ['Day', 'Night'],
  },
  username: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  completedTasks: {
    type: Number,
    default: 0,
  },
  totalTasks: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
    maxlength: 1000,
  },
  safetyTrends: {
    type: String,
    maxlength: 500,
  },
  majorCallout: {
    type: String,
    maxlength: 500,
  },
  yardUtilization: {
    type: Number,
    min: 0,
    max: 100,
  },
  yardAccuracy: {
    type: Number,
    min: 0,
    max: 100,
  },
  auditDefects: {
    type: Number,
    default: 0,
  },
  yardData: yardDataSchema,
  lateDepartures: [lateDepartureSchema],
  ycRoutines: ycRoutinesSchema,
}, {
  timestamps: true,
});

const ShiftLog = model('ShiftLog', shiftLogSchema);

export default ShiftLog;