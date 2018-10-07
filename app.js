const express = require('express');
const app = express();
const dataBaseConnection = require('./integration/dataBaseHandler');
const bodyParser = require('body-parser');
const expressSession = require('express-session');

const api = require('./routes/api');

app.listen(3000, () => {
    console.log("Server started on port 3000");
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(expressSession({secret: 'overwatchstats', saveUninitialized: false, resave: false}));

app.use('/', api);

module.exports = app;