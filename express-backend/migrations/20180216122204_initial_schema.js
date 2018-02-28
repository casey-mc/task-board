
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('User', table => {
      table.increments('id').primary();
      table.string('name');
      table.string('email')
    }),
    knex.schema.createTable('Task', table => {
      table.increments('id').primary();
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('User');
      table.string('task');
      table.integer('time');
   })
  ]);
};
exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableifExists('User'),
    knex.schema.dropTableifExists('Task')
  ]);
};
