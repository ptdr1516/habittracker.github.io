const express = require('express');
const app = express();
const flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session')

// DATABASE
const db = require('./config/mongoose').MongoURI;

// connection to mongo database
mongoose.connect(db, {
    useNewUrlParser: true, useUnifiedTopology: true
})
  .then(() => console.log('Successfully connected to mongoose database'))
  .catch((err) => console.log('Error connecting to database: ' + err));

// setting up ejs layouts and view engine
app.use(expressLayouts);
app.use('/assets', express.static('./assets'));
app.set('view engine', 'ejs');

// setting up express session
app.use(session({
    secret: 'habittracker',
    resave: true,
    saveUninitialized: true,
}));

// adding bodyParser
app.use(express.urlencoded({ extended: false }));

// flash messages
app.use(flash());

// setting global variables for appropriate messages
app.use(function(req, res, next) {
    res.locals.successMsg = req.flash('successMsg');
    res.locals.errorMsg = req.flash('errorMsg');
    res.locals.error = req.flash('error');
    next();
});

// setting up routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
const port = process.env.PORT || 8000;

app.listen(port, console.log(`Server is up and running on ${port}`));