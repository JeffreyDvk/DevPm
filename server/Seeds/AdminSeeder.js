const User = new (require('../Models/User.js'))();
const crypty = require('../Helpers/crypt.js');
const bcrypt = require("bcrypt");

User.getByKey('adm1n@devpm.com',async function(err,user){
    if(err) throw err
    if(!user.length){
        User.add({
            email:'adm1n@devpm.com', 
            password: "1234",
            nom: 'Ad1mn',
            prenoms: 'DevPm',
            status: 1,
            total_heure: 0
        },function(err,r){
            if(err) throw err
            console.log("AdminSeeder executed successfully !!");
        })
    }
    else{
        console.log("No seed needed for AdminSeeder !!");
    }
})
