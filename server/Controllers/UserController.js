const UserManager = new (require('../Models/User.js'))();

class UserController {

    static login(req,res){
        let $ = req.body
        UserManager.search($.email,$.password,function(find,user){
            if(!find) return res.send({ error: "Email ou Mot de passe incorrect" })
            return res.send({ success: "Utilisisateur loggé", user: user })
        })
    }

    static signin(req,res){
        let $ = req.body
        $.status = 0
        $.total_heure = 0
        UserManager.getByKey($.email,function(err,user){
            if(!user.length) 
                UserManager.add($,
                    function(err,r){ 
                        return res.send({ 
                            success: "Votre compte à été créé avec succès. Vous pouvez vous connecter" 
                        })})
            else
                return res.send({ error: "Cette adresse email est déjà utilisée" })
        })
    }

    static getUser(req,res){
        let $ = req.body
        UserManager.getByKey($.user,function(err,user){ 
            if(err) return res.send({ error: "Quelque chose s'est mal passé", }); 
            return res.send({ user: user[0] });
        })
    }

    static getUsers(req,res){
        let $ = req.body
        UserManager.getAll(
            function(err,users){ return res.send({ tasks: users.map(user=>{ return [user.nom,user.prenoms,user.specialite,user.total_heure] })});
        })
    }

    static updateUser(req,res){
        let $ = req.body
        let user = $.user
        delete $.user
        if($.password){
            if(crypty.compare($.password,$.actual_password))
                $.password = crypty.hash($.confirm)
            else return res.send({ error: "Mot de passe incorrect", });
            delete $.confirm
            delete $.actual_password
        }
        UserManager.updateByKey(user,$,function(err,result){
            if(err) return res.send({ error: "Quelque chose s'est mal passé", });
            return res.send({ success: "Informations modifiées avec succès" });
        })
    }
}

module.exports = UserController