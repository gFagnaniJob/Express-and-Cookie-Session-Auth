/* **** MODULES **** */
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieSession = require('cookie-session');
require('dotenv').config();

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
})

app.get('/login', checkNotAuthentication, (req, res) => {
    //renderizza pagina login
});

app.get('/personalPage', checkAuthentication, (req, res) => {
    res.render('personalPage');
})

/* **** POST's ROUTES **** */
app.post('/login', (req, res) => {
    //inizializza sessione
    //renderizza pagina personale
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

