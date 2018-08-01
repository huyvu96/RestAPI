var db = require('../Dbconnection');

var Movies={
    getInforByIdMovies:async function(id){
        var sql = "SELECT movies.id, movies.title, movies.title_en, movies.overview, movies.poster_path, movies.backdrop_path, \n \
         episodes.part, episodes.episode_number, episodes.release_date, episodes.run_time,episodes.url_link \n \
        FROM movies \n \
        INNER JOIN episodes \n \
        ON movies.id = episodes.id_movie where movies.id = ? and episodes.part=1";
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
	// addSV:function(sinhvien,callback){
	// 	return db.query("Insert into movies(name,class,dob) values(?,?,?)",[sinhvien.name,sinhvien.class,sinhvien.dob],callback);
	// },
	// deleteSV:function(id,callback){
	// 	return db.query("delete from movies where Id=?",[id],callback);
	// },
	// updateSV:function(id,sinhvien,callback){
	// 	return db.query("update movies set name=?,class=?,dob=? where Id=?",[sinhvien.name,sinhvien.class,sinhvien.dob,id],callback);
	// }
};
 module.exports=Movies;