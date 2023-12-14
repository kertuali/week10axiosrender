const express = require('express');
const axios = require('axios');
const http = require('http');
const mainRouter = require('./routes/mainRouters');
const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(mainRouter);

app.listen(process.env.PORT || 3000, () => {
    console.log('server is running on port 3000.');
});