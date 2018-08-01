var db = require('../Dbconnection');

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
                    //console.log(result);
                    resolve(result)
                }
            })
        });
	},
};
 module.exports=Episodes;