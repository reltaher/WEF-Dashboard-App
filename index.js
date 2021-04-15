const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const multer = require('multer');
const csvToDatabase = require('./public/javascripts/csvparser');

const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage});


const Data = require('./models/datalogger')

mongoose.connect('mongodb://localhost:27017/datalogger', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Mongo Connection Open")
    })
    .catch(err => {
        console.log("Error:")
        console.log(err)
    })

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('homedashboard');
    
})

app.post('/', upload.array('files'), async (req, res) => {
    console.log(req.files);
    
    req.files.forEach(element => {
        csvToDatabase.parseCsvToDatabase(element.buffer)
    });

    res.render('homedashboard');
})

app.get('/data', async (req, res) => {
    // This will hold the date
    const xs = [];

    const Gas_Sample_No = [];
    const CPU_Time = [];
    const Fluid_Temp = [];
    const Fluid_pH = [];
    const Gas_Temp = [];
    const Gas_RH = [];
    const Gas_Pressure = [];
    const Gas_MQ4 = [];
    const Gas_MQ135 = [];

    const response = await Data.find({
        Date: {
            $lte: new Date(req.query.before) || new Date(),
            $gt: new Date(req.query.after)
        }
    });
    console.log(response);

    for (let log of response) {
        xs.push(log.Date);   

        Gas_Sample_No.push(log.Gas_Sample_No);
        CPU_Time.push(log.CPU_Time);
        Fluid_Temp.push(log.Fluid_Temp);
        Fluid_pH.push(log.Fluid_pH);
        Gas_Temp.push(log.Gas_Temp);
        Gas_RH.push(log.Gas_RH);
        Gas_Pressure.push(log.Gas_Pressure);
        Gas_MQ4.push(log.Gas_MQ4);
        Gas_MQ135.push(log.Gas_MQ135);
    }
    
    res.json({
        xs,
        Gas_Sample_No,
        CPU_Time,
        Fluid_Temp,
        Fluid_pH,
        Gas_Temp,
        Gas_RH,
        Gas_Pressure,
        Gas_MQ4,
        Gas_MQ135
    });
 
})

app.listen(3000, () => {
    console.log("Listening on Port 3000")
})