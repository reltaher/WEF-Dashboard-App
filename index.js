const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const multer = require('multer');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash')


const csvToDatabase = require('./public/javascripts/csvparser');
const userRoutes = require('./routes/users')
const { isLoggedIn } = require('./middleware');

const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage});


const Data = require('./models/datalogger');
const User = require('./models/user');
const LocalStrategy = require('passport-local');
const ExpressError = require('./utils/ExpressError');

mongoose.connect('mongodb://localhost:27017/datalogger', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    name: 'session',
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(express.json());
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);

app.get('/', (req, res) => {
    res.render('users/login');
});

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

app.get('/dashboard', isLoggedIn, (req, res) => {
    res.render('homedashboard'); 
})

app.post('/dashboard', isLoggedIn, upload.array('files'), async (req, res) => {
    console.log(req.files);
    
    req.files.forEach(element => {
        csvToDatabase.parseCsvToDatabase(element.buffer)
    });

    res.render('homedashboard');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log("Listening on Port 3000")
})