const express = require("express");
const cron = require("node-cron");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

let tasks = [];

// Route to add task to the scheduler
app.post("/schedule", (req, res) => {
    const {name, time, repeat} = req.body;

    if (!name || ! time) {
        return res.status(400).json({error: "Task name and time required"});     
    }

    let cronTime = repeat ? time : `*/${time} * * * * *`; // Default to seconds
    const task = cron.schedule(cronTime, () =>{
        console.log(`Executing task${name}`)
    });

    task.push([name, cronTime, task]);
    res.json({message: "Task Scheduled", name, cronTime});
});

// Route to list all the tasls
app.get("/tasks", (req, res) =>{
    res.json(tasks.map(t=>({name: t.name, cronTime: t.cronTime})));
})

// Route to stop a task
app.delete("/stop/:name", (req, res) =>{
    const name = req.params.name;
    const taskIndex = tasks.findIndex(t => t.name === name);

    if (taskIndex === -1){
        return res.status(404).json({error: "Task not Found!"});
    }

    tasks[taskIndex].task.stop();
    tasks.splice(taskIndex, 1);
    res.json({mesage:`Task ${name} stopped and Removed.`});
});

const PORT = 3000;
app.listen(PORT, ()=> console.log(`Task Scheduler running in port ${PORT}`))