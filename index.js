/* **** MODULES **** */
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieSession = require('cookie-session');
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

/* **** START THE SERVER **** */
const PORT = process.env.PORT || 3000;
app.listen(PORT, function (req, res) {
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
});

app.get('/signup', checkNotAuthentication, (req, res) => {
    //render registration form page
});

app.get('/personalPage', checkAuthentication, (req, res) => {
    res.render('personalPage');
});

/* **** POST's ROUTES **** */
app.post('/signin', async (req, res) => {
    //get req data
    const User = {
        email: req.body.email,
        password: req.body.password
    };
    //check if User exists
    const exist = await UserController.checkIfUserExists(User);
    if (!exist) {
        jsonObject.errorMessage = "Email is not correct";
        res.redirect('/error');
    }
    //check if password is correct
    //initialize session
    //render personal page
});

app.post('signup', async (req, res) => {
    //get req data
    const NewUser = {
        email : req.body.email,
        password : req.body.password
    }
    //check if User is already signed up
    const exist = await UserController.checkIfUserExists(NewUser);
    if (exist) {
        jsonObject.errorMessage = "Email already used";
        res.redirect('/error');
    }
    //crypt password
    //save User on DB
    //initialize session
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

