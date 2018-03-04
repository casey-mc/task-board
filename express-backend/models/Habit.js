const Model = require('objection').Model;

class Habit extends Model {

    static get tableName() {
        return 'Habit';
    }

    static get jsonSchema() {
        return {
        type: 'object',
        required: ['task','time'],

        properties: {
            id: {type: 'integer'},
            user_id: {type: 'integer'},
            task: {type: 'string', minLength: 1, maxLength: 255 },
            time: {type: 'integer'},
            item_id: {type: 'integer'}
          }
        }
    }

    static get relationMappings() {
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                // modelClass: __dirname + '\\User',
                modelClass: require('./User'),
                join: {
                    from: 'Habit.user_id',
                    to: 'User.id'
                }
            },
            item: {
                relation: Model.HasOneRelation,
                modelClass: require('./Item'),
                join: {
                    from: 'Habit.item_id',
                    to: 'Item.id'
                }
            }
        };
    }
}

module.exports = Habit;