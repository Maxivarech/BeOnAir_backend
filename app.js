var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

const corsOptions = {
    origin: 'http://localhost:3000',
  };

var photoRouter = require('./routes/photos');
var serieRouter = require('./routes/series');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/images", express.static("images"));

app.use('/photos', cors(corsOptions),  photoRouter);
app.use('/series', cors(corsOptions),  serieRouter);

module.exports = app;
