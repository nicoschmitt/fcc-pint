require('dotenv').config({silent: true});

var path = require('path');

var mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI);

var express = require('express');
var sassMiddleware = require('node-sass-middleware');

var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(sassMiddleware({
    src: path.join(__dirname, "scss"),
    dest: path.join(__dirname, "client/css"),
    prefix: "/css",
    outputStyle: 'compressed',
    debug: false
}));

require('./server/routes').register(app);

app.use(express.static(path.resolve(__dirname, 'client')));

require("./server/start-http").start(app);
