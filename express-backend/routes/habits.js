const express = require('express');
const bodyParser = require('body-parser');
const Habit = require('../models/Habit');


const taskListRouter = express.Router();

taskListRouter.use(bodyParser.json());
taskListRouter.route('/')
.all((req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  next();
})
.get(async (req, res, next) => {
  let habits = await Habit.query();
  res.json(habits);
  console.log("sending", habits);
  // res.end('Will send all the habits to you!');
})
.post(async (req,res,next) => {
  console.log(req.body);
  try {
    let task = await Habit.query()
     .insert({task: req.body.task, time: req.body.time});
    res.json({id: task.id});
    console.log(task);
  } catch(err) {
    next(err);
  }
})
.delete(async (req, res, next) => {
  console.log(req.query.id);
  try {
    let task = await Habit.query()
      .delete()
      .where('id', req.query.id);
      res.end("Successfully deleted task");
  } catch(err) {
    next(err);
  }
});

module.exports= taskListRouter;
