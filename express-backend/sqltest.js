const Item = require('./models/Item');
const Task = require('./models/Task');
const Habit = require('./models/Habit');
const User = require('./models/User');
const Knex = require('knex');
const {Model} = require('objection');
const knexConfig = require('./knexfile');
const knex = Knex(knexConfig);

Model.knex(knex);

async function newItem() {
  try{
    let item = await Item.query()
      .patch({image: 'dot circle outline'})
      .where('name','Lucky Ring')
      // .insert({name: "Key of Fighting", description: 'No Idea', image: 'key' });
    console.log(item);
  } catch(err) {
    console.log(err);
  }

}

newItem();