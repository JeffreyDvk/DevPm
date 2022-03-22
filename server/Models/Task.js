let Model= require('./Model.js')

class TaskManager extends Model{
    constructor(){
        super({
            tableName: 'tasks',
            key: 'id',
            fields: {
                id: 'INT PRIMARY KEY NOT NULL AUTO_INCREMENT',
                description: 'TEXT',
                total_heure: 'INT',
                heure_consomme: 'INT',
                status: 'BOOLEAN' ,
                date_creation: 'DATETIME' ,
                date_fin: 'DATETIME',
                author: 'VARCHAR(30)'
            }
        })
    }
}

module.exports = TaskManager