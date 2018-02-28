const Model = require('objection').Model;

class Task extends Model {

    static get tableName() {
        return 'Item';
    }

    static get jsonSchema() {
        return {
        type: 'object',
        required: ['name','description'],

        properties: {
            id: {type: 'integer'},
            user_id: {type: 'integer'},
            name: {type: 'string', minLength: 1, maxLength: 255 },
            description: {type: 'string', minLength: 1, maxLength: 255 },
            image: {type: 'string', minLength: 1, maxLength: 255},
            stats: {type: 'object'},
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
                    from: 'Item.user_id',
                    to: 'Item.id'
                }
            },
            habit: {
                relation: Model.BelongsToOneRelation,
                modelClass: require('./Item'),
                join: {
                    from: 'Item.id',
                    to: 'Habit.item_id'
                }
            }
        };
    }
}

module.exports = Task;