var db = require('../ConnectDatabase/Dbconnection');

var Episodes={
	getAllEpisodesbyIdMovie:function(id){
        var sql = "SELECT episodes.id, episodes.part, episodes.url_link \n\
        FROM episodes where episodes.id_movie= ?";
        return new Promise(function (resolve, reject)
        {
            db.query(sql, [id], function (err, result)
            {
                if (err)
                {
                    reject(err)
                } else
                {
                    resolve(result)
                }
            })
        });
	},
};
 module.exports=Episodes;