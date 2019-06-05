const express = require('express');
const router = express.Router();
const Joi = require('joi');

//TASK CLASS
class Task {
    constructor(id, name, description){
        this.id = id,
        this.name = name,
        this.description = description,
        this.creationDate = new Date(),
        this.status = 'to do'
    }
}

//OBJECT ARRAY
var tasks = [];
tasks[0] = new Task(1, 'task from server', 'this is my first task retrieved from the server');


router.get('/', (req, res) => {
    res.send(tasks);
});

//VALIDATION FUNCTION
function validateTask(taskObj) {
    const schema = {
        name: Joi.string().min(3).max(30).required(),
        description: Joi.string().min(3).max(280).required()
    };

    return Joi.validate(taskObj, schema);
}


//show specific task
router.get('/:id', (req, res) => {
    const task = tasks.find(tsk => tsk.id === parseInt(req.params.id));
    if(!task)
        return res.status(404).send('The task was not found');
    res.send(task);
});

//create task
router.post('/', (req, res) => {
    const result = validateTask(req.body);

    if(result.error)
        return res.status(400).send(result.error.details[0].message);

    //create object with new values and push to array
    
    var taskObj = new Task(tasks.length + 1, req.body.name, req.body.description);
    tasks.push(taskObj);
    res.send(taskObj);
});

//edit task
router.put('/:id', (req,res) => {
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

router.delete('/:id', (req, res) => {
    //look up course
    
    const task = tasks.find(tsk => tsk.id === parseInt(req.params.id));
    //if not existing, return 404
    console.log('Task to be deleted: ' + task);
    if(!task)
        return res.status(404).send('The course with the given id was not found');
    
    //delete course
    const index = tasks.indexOf(task);
    tasks.splice(index, 1);

    //return the same course
    res.send(task);
});

module.exports = router;