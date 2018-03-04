const Model = require('objection').Model;

class Item extends Model {

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
            image: {type: 'string', minLength: 1, maxLength: 255}, // For now this is just the corresponding Semantic Icon prop "name"
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
                    to: 'User.id'
                }
            },
            habit: {
                relation: Model.BelongsToOneRelation,
                modelClass: require('./Habit'),
                join: {
                    from: 'Item.id',
                    to: 'Habit.item_id'
                }
            }
        };
    }
}

module.exports = Item;