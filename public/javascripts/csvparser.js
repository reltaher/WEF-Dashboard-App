const Data = require('../../models/datalogger');
const csvParser = require('csvtojson');

const csvHeaders = {
    'Sub-Sample No.': "Sub-Sample_No",
    'Gas Sample No.': "Gas_Sample_No",
    'Significant Measure': "Significant_Measure",
    'CPU Time': "CPU_Time",
    'Date/Time (EST)': "Date",
    'Fluid Temp (C)': "Fluid_Temp",
    'Fluid pH': "Fluid_pH",
    'Gas Temp (C)': "Gas_Temp",
    'Gas RH%': "Gas_RH",
    'Gas Pressure (hPa)': "Gas_Pressure",
    'Gas MQ4 (Volts/5.0)': "Gas_MQ4",
    'Gas MQ135 (Volts/5.0)': "Gas_MQ135",
    'Dry fail': "Dry_fail"
};

const parseCsvToDatabase = function(csvFile) {
    csvParser({
        headers: Object.values(csvHeaders),
    })
        .fromString(csvFile.toString())
        .then((datas) => {
            datas.forEach(data => {
                Data.create(data)
            })
        })
}

module.exports.parseCsvToDatabase = parseCsvToDatabase;
