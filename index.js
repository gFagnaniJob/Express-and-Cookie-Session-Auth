/* **** MODULES **** */
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var session = require('express-session');
const cookieSession = require('cookie-session');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

/* **** MODELS **** */
var UserModel = require('./models/user');

/* **** CONTROLLERS **** */
var UserController = require('./controllers/user');

/* **** GLOBAL VARIABLES **** */
var jsonObject = {};

/* **** MIDDLEWARES **** */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieSession(
    {
        name: 'session',
        keys: [process.env.COOKIE_SESSION_KEY]
    }
));

app.set('view engine', 'ejs');

/* **** CONNECTION ON DB **** */
const mongoDB = 'mongodb://127.0.0.1/NodeJsExpress';
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/* **** START THE SERVER **** */
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log("Server listening on port " + PORT);
});

/* **** GET's ROUTES **** */
app.get('/', (req, res) => {
    res.render('homepage');
});

app.get('/error', (req, res) => {
    res.render('errorPage', jsonObject);
});

app.get('/signin', checkNotAuthentication, (req, res) => {
    //render login page
    console.log("session", req.session);
    console.log("session.user", req.session.user);
    res.render('signin');
});

app.get('/signup', checkNotAuthentication, (req, res) => {
    //render registration form page
    res.render('signup');
});

app.get('/personalPage', checkAuthentication, (req, res) => {
    res.render('personalPage', {
        user : req.session.user
    });
});

/* **** POST's ROUTES **** */
app.post('/signin', checkNotAuthentication, async (req, res) => {
    //get req data
    const User = {
        email: req.body.email,
        password: req.body.password
    };
    //check if User exists
    const USER = await UserModel.findOne({email : User.email});
    if (!USER) {
        jsonObject.errorMessage = "Email is not correct";
        return res.redirect('/error');
    }
    //check if password is correct
    bcrypt.compare(User.password, USER.password, function (err, result) {
        if (err) {
            jsonObject.errorMessage = "ERROR ON COMPARE PASSWORDS\n" + err.toString();
            return res.redirect('/error');
        }
        if (!result) {
            jsonObject.errorMessage = "Password is not correct";
            return res.redirect('/error');
        }
        //initialize session
        req.session.user = User;
        session = req.session;
        //render personal page
        res.redirect('/personalPage');
    });
});

app.post('/signup', checkNotAuthentication, async (req, res) => {
    //get req data
    const NewUser = {
        email: req.body.email,
        password: req.body.password
    }
    //check if User is already signed up
    const exist = await UserController.checkIfUserExists(NewUser);
    if (exist) {
        jsonObject.errorMessage = "Email already used";
        return res.redirect('/error');
    }
    //save User on DB
    const USER = new UserModel({
        email: NewUser.email,
        password: NewUser.password
    });
    USER.save(function (err) {
        if (err) {
            jsonObject.errorMessage = "ERROR ON SAVING USER\n" + err.toString();
            return res.redirect('/error');
        }
    })
    //initialize session
    req.session.user = NewUser;
    session = req.session;
    //redirect to personal page
    res.redirect('/personalPage');
});

app.post('/logout', checkAuthentication, (req, res) => {
    req.session = null;
    session = null;
    res.redirect('/signin');
});

/* **** UTILITIES METHODS **** */
function checkNotAuthentication(req, res, next) {
    if (session && session.user) {
        jsonObject.errorMessage = "You are already logged in, visit our website";
        res.redirect('/error');
    } else {
        next();
    }
}

function checkAuthentication(req, res, next) {
    if (session && session.user) {
        next();
    } else {
        jsonObject.errorMessage = "You have to be logged in to visit this page";
        res.redirect('/error');
    }
}