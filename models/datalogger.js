const mongoose = require('mongoose');

const loggerSchema = new mongoose.Schema({
    Sub_Sample_No: Number,
    Gas_Sample_No: Number,
    Significant_Measure: String,
    CPU_Time: Number,
    Date: Date,
    Fluid_Temp: Number,
    Fluid_pH: Number,
    Gas_Temp: Number,
    Gas_RH: Number,
    Gas_Pressure: Number,
    Gas_MQ4: Number,
    Gas_MQ135: Number,
    Dry_fail: String
})

const Data = mongoose.model('Logger', loggerSchema);

module.exports = Data;