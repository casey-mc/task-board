const express = require('express');
const bodyParser = require('body-parser');
const Item = require('../models/Item');


const taskListRouter = express.Router();

taskListRouter.use(bodyParser.json());
taskListRouter.route('/')
.all((req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  next();
})
.get(async (req, res, next) => {
  let items = await Item.query();
  res.json(items);
  console.log("sending", items);
  // res.end('Will send all the habits to you!');
})
.post(async (req,res,next) => {
  console.log(req.body);
  try {
    let item = await Item.query()
     .insert({task: req.body.task, time: req.body.time});
    res.json({id: item.id});
    console.log(item);
  } catch(err) {
    next(err);
  }
})
.delete(async (req, res, next) => {
  console.log(req.query.id);
  try {
    let item = await Item.query()
      .delete()
      .where('id', req.query.id);
      res.end("Successfully deleted item");
  } catch(err) {
    next(err);
  }
});

module.exports= taskListRouter;
