const express = require('express');
const cors = require('cors');
const userRoute = require('./routes/user_routes/user_routes');
const genderRoute = require('./routes/gender_routes/gender_route');

const app = express();

app.use('/uploads', express.static('uploads'));
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true}));

app.use(cors({}));
app.enable("trust proxy");

app.use(`${process.env.API_URL}/authentication`, userRoute);
app.use(`${process.env.API_URL}/gender`, genderRoute);

module.exports = app;