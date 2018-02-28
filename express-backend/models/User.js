const Model = require('objection').Model;

class User extends Model {

    static get tableName() {
        return 'User';
    }

    static get jsonSchema() {
        return {
        type: 'object',
        required: ['name','email'],

        properties: {
            id: {type: 'integer'},
            name: {type: 'string', minLength: 1, maxLength: 255 },
            email: {type: 'string', minLength: 1, maxLength: 255 }
        }
    };
    }

    static get relationMappings() {
        return {
        task: {
            relation: Model.HasManyRelation,
            // modelClass: __dirname + '\\Task',
            modelClass: require('./Task'),
            join: {
                from: 'User.id',
                to: 'Task.user_id'
            }
        },
        habit: {
            relation: Model.HasManyRelation,
            // modelClass: __dirname + '\\Task',
            modelClass: require('./Habit'),
            join: {
                from: 'User.id',
                to: 'Habit.user_id'
            }
        },
        Item: {
            relation: Model.HasManyRelation,
            modelClass: require('.Item'),
            join: {
                from: 'User.id',
                to: 'Item.user_id'
            }
        }
    }
}
}

module.exports = User;