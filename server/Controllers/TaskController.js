const Task = new (require('../Models/Task.js'))();

class TaskController {

    static addTask(req,res){
        let $ = req.body
        Task.insert({
            description: $.description,
            total_heure: $.duree,
            heure_consomme: $.heure_consomme,
            status: 1,
            date_creation: $.date_debut ,
            date_fin: null,
            author: $.author
        },function(err, r){ 
            if(err) return res.send({ error: "Quelque chose s'est mal passé", });
            return res.send({ success: "Tâche crée avec succès", }); 
        })
    }

    static deleteTask(req,res){
        Task.deleteByKey(req.body.key,function(err,r){
            if(err) return res.send({ error: "Quelque chose s'est mal passé", });
            return res.send({ success: "Tâche supprimée avec succès", });
        })
    }

    static getAllTasks(req,res){
        let $ = req.body
        Task.getWhere({author: $.user},function(err,tasks){
            if(err) return res.send({ error: "Quelque chose s'est mal passé", });
            return res.send({ tasks: tasks.map(task=>{ return [task.id,task.description,task.total_heure,task.heure_consomme,task.status] }), }); 
        })
    }

    static updateTask(req,res){
        let $ = req.body
        Task.updateByKey($.key,{
            description: $.description,
            heure_consomme: $.heure_consomme,
            status: $.fini,
            date_fin: $.fini ? (new Date(Date.now())) : null,
        },function(err){
            if(err) return res.send({ error: "Quelque chose s'est mal passé", });  
            return res.send({ success: "Tâche modifiée avec succès", });
        })
    }
}

module.exports = TaskController