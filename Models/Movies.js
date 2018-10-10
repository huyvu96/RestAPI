var db = require('../ConnectDatabase/Dbconnection');

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
                    resolve(result[0])
                }
            })
        });
    },
    searchAllMovies:async function(query, page , size){
        var soitem = size;
        var sophantu =(page-1) * soitem;
        var byTitle = "select id from movies where title like N'%"+ query +"%'";
        var byNamePeople = "select movies.id FROM ((movies_people INNER JOIN movies ON movies.id = movies_people.id_movie) INNER JOIN people ON people.id = movies_people.id_people) where people.name_people like N'%"+ query +"%'";
        var byOverView = "select id from movies where overview like N'%"+ query +"%'";
        var sql = "select * from movies where (id in ("+byTitle+") or id in ("+byNamePeople+") or id in ("+byOverView+")) limit "+sophantu+","+ soitem;
        return new Promise(function (resolve, reject)
        {
            db.query(sql,[query], function (err, result)
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
    }
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