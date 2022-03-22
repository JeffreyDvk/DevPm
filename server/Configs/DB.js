const env = require('dotenv').config().parsed
var db = require(`mysql`).createConnection({
    host: env.DB_HOST,
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
});

function initTables(TABLES,idx,cb){
    if(idx>=TABLES.length) return cb()
    const T = TABLES[idx]
    db.query(`CREATE TABLE IF NOT EXISTS ${T.table} (${T.getFields()})`,function(err,result){
        if (err) throw err
        console.log(`Table ${T.table} initialised`);
        initTables(TABLES,++idx,cb)
    }) 
}

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    db.query(`CREATE DATABASE IF NOT EXISTS ${env.DB_NAME};`, function (err, result) {
        if (err) throw err;
        db.query(`USE ${env.DB_NAME};`, function (err, result) {
            if (err) throw err;
            console.log("Database selected");
            initTables(require('../Models/RegisterModels'),0,function(){
                require('../Seeds/RegisterSeeder');
            })
        })
    });
})

module.exports = db
