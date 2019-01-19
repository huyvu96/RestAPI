var db = require('../ConnectDatabase/Dbconnection');

var Channel = {
    getAllChannel: function () {
        var sql = "select * from channel";
        return new Promise(function (resolve, reject) {
            db.query(sql, function (err, result) {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        });
    },
    getCalenderByChannel: function () {
        var sql = "SELECT movies.id, movies.title, movies.title_en, movies.overview, movies.poster_path, movies.backdrop_path, movies.rating, time_of_date.time as start_time from movies inner join time_of_date on movies.id = time_of_date.id_movie";
        return new Promise(function (resolve, reject) {
            db.query(sql, function (err, result) {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        });
    },
};
module.exports = Channel;