require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(session({
    secret: 'deinGeheimerSchlüssel',
    resave: false,
    saveUninitialized: false,
    cookie: {
    secure: false,
    httpOnly: true
    }
}));
app.use(express.json());
app.use('/api', require('./routes/api'));
app.use('/home', require('./routes/home'));

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.error('Successfully connected to Database...'));
const port = process.env.SERVER_PORT || 500;
app.listen(port, () => console.info(`Server is running in port ${port}`));