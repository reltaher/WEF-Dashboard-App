const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    TIMESTAMP: String,
    RECORD: Number,
    Datalogger_Supply_Voltage: Number,
    Main_System_Battery_Voltage: Number,
    Datalogger_Panel_Temp: Number,
    Ambient_Air_Temp: Number,
    Back_of_Module_Temp_1: Number,
    Wind_Speed: Number,
    Wind_Direction_CW_N: Number,
    Global_Horizontal_Irradiance: Number,
    Diffuse_Horizontal_Irradiance: Number,
    Direct_Normal_Irradiance: Number,
    CS_Solar_Azimuth_N: Number,
    CS_Solar_Elevation: Number,
    CS_Solar_Declination: Number,
    Total_Precipitation: Number
})

const Data = mongoose.model('Log', logSchema);

module.exports = Data;