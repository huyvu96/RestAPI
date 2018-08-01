var db = require('../Dbconnection');

var Category={
	getAllMoviesbyCategory:function(page,category){
		var soitem ="10";
        var sophantu =(page-1) * soitem;
        var sql = "SELECT movies.id, movies.title, movies.title_en, movies.overview, movies.poster_path, \n \
        movies.backdrop_path \n \
        FROM movies \n \
        INNER JOIN category \n \
        on movies.id_category = category.id  where  category.name_category=? limit "+sophantu+","+soitem;
        return new Promise(function (resolve, reject)
        {
            db.query(sql, [category], function (err, result)
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
        // return db.query("SELECT movies.id, movies.title, movies.title_en, movies.overview, movies.poster_path, \n \
        // movies.backdrop_path \n \
        // FROM movies \n \
        // INNER JOIN category \n \
        // on movies.id_category = category.id  where  category.name_category=? limit "+sophantu+","+soitem,[category],callback)
    },
    getTopMoviesbyCategory:function(category){
        var sql = "SELECT movies.id, movies.title, movies.title_en, movies.overview, movies.poster_path, movies.backdrop_path \n\
        FROM movies \n\
        INNER JOIN category \n\
        on movies.id_category = category.id  where  category.name_category=? order by rand() limit 0,5";
        return new Promise(function (resolve, reject)
        {
            db.query(sql, [category], function (err, result)
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
        // return db.query("SELECT movies.id, movies.title, movies.title_en, movies.overview, movies.poster_path, \n \
        // movies.backdrop_path \n \
        // FROM movies \n \
        // INNER JOIN category \n \
        // on movies.id_category = category.id  where  category.name_category=? limit "+sophantu+","+soitem,[category],callback)
	},
};
 module.exports=Category;