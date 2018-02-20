const express = require('express');
const bodyParser = require('body-parser');
const Task = require('../models/Task');


const taskListRouter = express.Router();

taskListRouter.use(bodyParser.json());
taskListRouter.route('/')
.all((req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  next();
})
.get(async (req, res, next) => {
  let tasks = await Task.query();
  res.json(tasks);
  console.log("sending", tasks);
  // res.end('Will send all the tasks to you!');
})
.post(async (req,res,next) => {
  console.log(req.body);
  try {
    let task = await Task.query()
     .insert({task: req.body.task, time: req.body.time})
    console.log(task);
  } catch(err) {
    next(err);
  }
  });
// });
// .put((req,res,next) => {
//   res.statusCode = 403;
//   res.end('PUT operation not supported on /dishes');
// })
// .delete((req, res, next) => {
//   res.end('Deleting all the dishes!');
// });

module.exports= taskListRouter;
