var db = require('../ConnectDatabase/Dbconnection');

const Genres={
    getAllGenres: function(page,size){
        var soitem = size;
        var sophantu =(page-1) * soitem;
        var sql = "select * from genres limit "+sophantu+","+soitem;
        return new Promise(function (resolve, reject)
        {
            db.query(sql, function (err, result)
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
    }
    ,
    getGenresByIdMovies:function(id){
        var sql = "SELECT genres.id, genres.name_genre \n \
        FROM ((movies_genres \n \
        INNER JOIN movies ON movies.id = movies_genres.id_movie) \n \
        INNER JOIN genres ON genres.id = movies_genres.id_genre) where movies.id= ?";
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
    getAllMoviebyGenres:function(id,name,page,size){
        var soitem =size;
        var sophantu =(page-1) * soitem;
        var sql = "SELECT genres.name_genre, movies.id, movies.title, movies.title_en,\n \
         movies.overview, movies.poster_path, movies.backdrop_path, movies.id_category \n \
        FROM ((movies_genres \n \
        INNER JOIN movies ON movies.id = movies_genres.id_movie) \n \
        INNER JOIN genres ON genres.id = movies_genres.id_genre) \n \
         where genres.name_genre=? or genres.id=? limit "+sophantu+","+soitem;
        return new Promise(function (resolve, reject)
        {
            db.query(sql, [name,id], function (err, result)
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
 module.exports=Genres;