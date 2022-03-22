var crypty = require(`../Helpers/crypt.js`); 
let Model = require('./Model.js')

class UserManager extends Model{
    constructor(){
        super({
            tableName: 'users',
            key: 'email',
            fields: {
                email: 'VARCHAR(30) PRIMARY KEY',
                password: 'VARCHAR(100)',
                nom: 'VARCHAR(30)',
                prenoms: 'VARCHAR(50)',
                date_naissance: 'DATE' ,
                nationalite: 'VARCHAR(30)' ,
                specialite: 'VARCHAR(30)',
                status: 'BOOLEAN' ,
                total_heure: 'INT'
            }
        })
    }
    add(data,cb){
        data.password = crypty.hash(data.password)
        super.insert(data,cb)
    }
    search(key,password,cb){
        super.getByKey(key,function(err,user){
            if(!user[0]){ return cb(false) }
            return crypty.compare(password,user[0].password) ? cb(true,user[0]) : cb(false)
        })
        
    }
}

module.exports = UserManager