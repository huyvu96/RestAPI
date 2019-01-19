var db = require('../ConnectDatabase/Dbconnection');

var Category = {
    getAllMoviesbyCategory: function (category, page, size) {
        var soitem = size;
        var sophantu = (page - 1) * soitem;
        var sql = "SELECT movies.id, movies.title, movies.title_en, movies.overview, movies.poster_path, \n \
        movies.backdrop_path, movies.rating \n \
        FROM movies \n \
        INNER JOIN category \n \
        on movies.id_category = category.id  where  category.id= ? limit " + sophantu + "," + soitem;
        return new Promise(function (resolve, reject) {
            db.query(sql, [category], function (err, result) {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        });
    },
    getTopMoviesbyCategory: function (category, page, size) {
        var soitem = size;
        var sophantu = (page - 1) * soitem;
        var sql = "SELECT movies.id, movies.title, movies.title_en, movies.overview, movies.poster_path, movies.backdrop_path, movies.rating \n\
        FROM movies \n\
        INNER JOIN category \n\
        on movies.id_category = category.id  where  category.name_category=? order by rand() limit " + sophantu + "," + soitem;
        return new Promise(function (resolve, reject) {
            db.query(sql, [category], function (err, result) {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        });
    },
};
module.exports = Category;