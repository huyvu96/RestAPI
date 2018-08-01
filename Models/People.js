var db = require('../Dbconnection');

var People={
    getActorByIdMovies: function(id){
        var sql = "SELECT people.id, people.name_people \n \
        FROM ((movies_people \n \
        INNER JOIN movies ON movies.id = movies_people.id_movie) \n \
        INNER JOIN people ON people.id = movies_people.id_people) where movies.id=? and people.key_check=true";
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
    getDirectorByIdMovies:async function(id){
        var sql = "SELECT people.id, people.name_people \n \
        FROM ((movies_people \n \
        INNER JOIN movies ON movies.id = movies_people.id_movie) \n \
        INNER JOIN people ON people.id = movies_people.id_people) where movies.id=? and people.key_check=false";
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
    getAllMoviesbyActor:function(page,actor){
		var soitem ="10";
        var sophantu =(page-1) * soitem;
        var sql = "SELECT movies.id, movies.title, movies.title_en, movies.overview, \n \
        movies.poster_path, movies.backdrop_path \n \
        FROM ((movies_people \n \
        INNER JOIN movies ON movies.id = movies_people.id_movie) \n \
        INNER JOIN people ON people.id = movies_people.id_people) \n \
        where people.name_people=? limit  "+sophantu+","+soitem;
        return new Promise(function (resolve, reject)
        {
            db.query(sql, [actor], function (err, result)
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
 module.exports=People;