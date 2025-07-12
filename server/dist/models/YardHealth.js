const { Schema, model } = require('mongoose');
const yardHealthSchema = new Schema({
    date: {
        type: Date,
        required: true,
        unique: true,
    },
    totalTrailers: {
        type: Number,
        required: true,
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
    yardData: {
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
    },
    lateDepartures: [{
            loadId: { type: String, required: true },
            store: { type: String, required: true },
            trailer: { type: String, required: true },
            critical: { type: String, required: true },
            actual: { type: String, required: true },
            reason: { type: String, required: true },
        }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});
const YardHealth = model('YardHealth', yardHealthSchema);
export default YardHealth;
