const bcrypt = require("bcrypt");

let crypty = {
    hash: function(text){
        return bcrypt.hashSync(text, 5);
    },
    compare: function(text,hash){
        return bcrypt.compareSync(text, hash);
    },
}

module.exports = crypty