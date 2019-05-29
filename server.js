const Joi = require('joi');
const express = require('express');
const app = express();

//MIDDLEWARE
app.use(express.json());

//ENV variable PORT to dynamically allocate a port #
const port = process.env.PORT || 3000;

//call a function when page is rendered
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});

//OBJECT ARRAY
var tasks = [];

//VALIDATION FUNCTION
function validateTask(taskObj) {
    const schema = {
        name: Joi.string().min(3).max(30).required(),
        description: Joi.string().min(3).max(280).required()
    };

    return Joi.validate(taskObj, schema);
}

//get all tasks at '/'
app.get('/', (req, res) => {
    res.send(tasks);
});

//show specific task
app.get('/api/tasks/:id', (req, res) => {
    const task = tasks.find(tsk => tsk.id === parseInt(req.params.id));
    if(!task)
        return res.status(404).send('The task was not found');
    res.send(task);
});

//create task
app.post('/api/tasks', (req, res) => {
    const result = validateTask(req.body);

    if(result.error)
        return res.status(400).send(result.error.details[0].message);

    //create object with new values and push to array
    const taskObj = {
        id: tasks.length + 1,
        name: req.body.name,
        description: req.body.description,
        creationDate: new Date(),
        completionDate: '',
        status: 'to do'
    };
    
    tasks.push(taskObj);
    res.send(tasks);
});
//edit task
app.put('/api/tasks/:id', (req,res) => {
    const task = tasks.find(tsk => tsk.id === parseInt(req.params.id));

    if(!task)
        return res.status(404).send('The task was not found');
    
    //validate input
    const result = validateTask(req.body);
    if(result.error) 
       return res.status(400).send(result.error.details[0].message);
    
    //update task
    task.name = req.body.name;
    task.description = req.body.description;

    res.send(task);
});

app.delete('/api/tasks/:id', (req, res) => {
    //look up course
    const task = tasks.find(tsk => tsk.id === parseInt(req.params.id));
    //if not existing, return 404
    if(!task)
        return res.status(404).send('The course with the given id was not found');
    
    //delete course
    const index = tasks.indexOf(task);
    tasks.splice(index, 1);

    //return the same course
    res.send(task);
});