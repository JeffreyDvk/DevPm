
class Model {
    
    constructor(params){
        this.fields = params.fields
        this.driver = require('dotenv').config().parsed.DB_DRIVER
        this.table = params.tableName
        this.key = params.key
        this.db = require(`../Configs/DB.js`); 
    }
    getFields(){return this.format(this.fields,3)}
    
    format(data,type=1){
        let fields = ''
        switch(type){
            case 1:
                let values = ''
                Object.keys(data).forEach(f=>{
                    fields+= f+','
                    values+= '?,'
                })
                fields = fields.slice(0, -1)
                values = values.slice(0, -1)
                return {fields,values}
            case 2:
                Object.keys(data).forEach(f=>{
                    fields+= f+' = ?,'
                })
                fields = fields.slice(0, -1)
                return fields
            case 3:
                Object.keys(data).forEach(f=>{
                    fields+= f+' '+data[f]+','
                })
                fields = fields.slice(0, -1)
                return fields
            default:
        }
        
    }
    getByKey(key,cb){
        if(this.driver === 'mysql'){
            this.db.query(`SELECT * FROM ${this.table} WHERE ${this.key} = ?`,[key],function(err,result){cb(err,result)}) 
        }
    }
    getAll(cb){
        if(this.driver === 'mysql'){
            this.db.query(`SELECT * FROM ${this.table}`,[],function(err,result){cb(err,result)}) 
        }
    }
    getWhere(param,cb){
        if(this.driver === 'mysql'){
            let query = `SELECT * FROM ${this.table} WHERE ${Object.keys(param)[0]} = ?`
            this.db.query(query,[Object.values(param)[0]],function(err,result){ cb(err,result) }) 
        }
    }
    insert(data,cb){
        if(this.driver === 'mysql'){
            let r = this.format(data,1)
            this.db.query(`INSERT INTO ${this.table} (${r.fields}) VALUES (${r.values}) `,Object.values(data),function(err,result){cb(err,result)}) 
        }
    }
    updateByKey(key,data,cb){
        if(this.driver === 'mysql'){
            let r = this.format(data,2)
            let values = Object.values(data)
            values.push(key)
            this.db.query(`UPDATE ${this.table} SET ${r} WHERE ${this.key} = ? `,values,function(err,result){cb(err,result)}) 
        }
    }
    deleteByKey(key,cb){
        if(this.driver === 'mysql'){
            this.db.query(`DELETE FROM ${this.table} WHERE ${this.key} = ? `,key,function(err,result){cb(err,result)}) 
        }
    }
}

module.exports = Model