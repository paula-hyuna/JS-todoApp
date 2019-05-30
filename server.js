const Joi = require('joi');
const tasks = require('./routes/tasks')
const express = require('express');
const app = express();
const path = require('path');
const index_path = path.join(__dirname, './index.html');

//MIDDLEWARE
app.use(express.json()); //req.body for any JSON 
app.use(express.urlencoded({extended: true}));//key=value&key=value -> req.body. works for arrays and objects too
app.use(express.static('public'));
app.use('/api/tasks', tasks);


app.get('/', (req, res) => {
    res.sendFile(index_path);

});

//ENV variable PORT to dynamically allocate a port #
const port = process.env.PORT || 3000;

//call a function when page is rendered
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});

