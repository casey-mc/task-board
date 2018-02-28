
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('Habit', table => {
            table.increments('id').primary();
            table
              .integer('user_id')
              .unsigned()
              .references('id')
              .inTable('User');
            table.string('task');
            table.integer('time');
            table
              .integer('item_id')
              .unsigned()
              .references('id')
              .inTable('Item');
          }),
        knex.schema.createTable('Item', table => {
            table.increments('id').primary();
            table
              .integer('user_id')
              .unsigned()
              .references('id')
              .inTable('User');
            table.string('name');
            table.string('description');
            table.string('image');
            table.json('stats');
          })
    ]);
  };
  exports.down = function(knex, Promise) {
    return Promise.all([
      knex.schema.dropTableifExists('Habit'),
      knex.schema.dropTableifExists('Item')
    ]);
  };
  