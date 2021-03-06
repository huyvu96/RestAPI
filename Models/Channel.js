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
        var sql = "SELECT movies.id, movies.title, movies.title_en, movies.overview, movies.poster_path, movies.backdrop_path, movies.rating, time_of_date.time as start_time, time_of_date.seconds as duration from movies inner join time_of_date on movies.id = time_of_date.id_movie";
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
    insertTime: async function (time,idMovie,duration) {
        var insertData = "insert into time_of_date values (null, ? ,1, ?,?)";
        return new Promise(function (resolve, reject) {
            db.query(insertData.split("undefined").join("null"), [time, idMovie,duration], function (err, result) {
                if (err) {
                    return reject(err)
                } else {
                    return resolve(result)
                }
            })
        });
    },
    checkExist: async function () {
        var checkExist = "select * from time_of_date where id_canlendar = 1";
        return new Promise(function (resolve, reject) {
            db.query(checkExist.split("undefined").join("null"), function (err, result) {
                if (err) {
                    return reject(err)
                } else {
                    return resolve(result)
                }
            })
        });
    },
    deleteTime: async function (id) {
        var deleteData = "delete from time_of_date where id_canlendar = ?";
        return new Promise(function (resolve, reject) {
            db.query(deleteData.split("undefined").join("null"), [id], function (err, result) {
                if (err) {
                    return reject({success: false, data: [], message: err})
                } else {
                    return resolve({success: true, data: result, message: "DELETE_SUCCESSFUL"})
                }
            })
        });
    },
    deleteMovie: async function (id) {
        var deleteData = "delete from time_of_date where id_movie = ?";
        return new Promise(function (resolve, reject) {
            db.query(deleteData.split("undefined").join("null"), [id], function (err, result) {
                if (err) {
                    return reject({success: false, data: [], message: err})
                } else {
                    return resolve({success: true, data: result, message: "DELETE_SUCCESSFUL"})
                }
            })
        });
    },
    insertDuration: async function (idMovie,time) {
        var insertData = "insert into streaming values (?, ?)";
        return new Promise(function (resolve, reject) {
            db.query(insertData.split("undefined").join("null"), [idMovie, time], function (err, result) {
                if (err) {
                    return reject({success: false, data: [], message: err})
                } else {
                    return resolve({success: true, data: result, message: "INSERT_SUCCESSFUL"})
                }
            })
        });
    },
    deleteDuration: async function (idMovie) {
        var deleteData = "delete from streaming where id = ?";
        return new Promise(function (resolve, reject) {
            db.query(deleteData.split("undefined").join("null"), [idMovie], function (err, result) {
                if (err) {
                    return reject({success: false, data: [], message: err})
                } else {
                    return resolve({success: true, data: result, message: "DELETE_SUCCESSFUL"})
                }
            })
        });
    },
    getDuration: async function (idMovie) {
        var deleteData = "select * from streaming";
        return new Promise(function (resolve, reject) {
            db.query(deleteData.split("undefined").join("null"), [idMovie], function (err, result) {
                if (err) {
                    return reject(err)
                } else {
                    return resolve(result)
                }
            })
        });
    },
};
module.exports = Channel;