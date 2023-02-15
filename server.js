require('dotenv').config();
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const sequelize = require('./config/connection');
const allRoutes = require('./controllers');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const fs = require("fs");
const path = require("path");

// Create the needed "/public/images" folder
const imagesFolder = fs.mkdirSync(path.join(__dirname, "/public/images"),{recursive: true})

//initialize express and env.PORT or || 3000
const app = express();
const PORT = process.env.PORT || 3000;

//creates the session with env Secret code
const sess = {
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60 * 2
    },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//initilizes handlebars
const hbs = exphbs.create({});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//uses public folders
//uses the session
//uses routes folder for controllers
app.use(express.static('public'));
app.use(session(sess));
app.use(allRoutes);

//stars the server and sequelize
sequelize.sync({ force: false }).then(function () {
    app.listen(PORT, function () {
        console.log('App listening on PORT ' + PORT);
    });
});