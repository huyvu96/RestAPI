var db = require('../ConnectDatabase/Dbconnection');

var Movies = {
    getInforByIdMovies: async function (id) {
        var sql = "SELECT movies.id, movies.title, movies.title_en, movies.overview, movies.poster_path, movies.backdrop_path, movies.rating,  \n \
         episodes.part, episodes.episode_number, episodes.release_date, episodes.run_time,episodes.url_link \n \
        FROM movies \n \
        INNER JOIN episodes \n \
        ON movies.id = episodes.id_movie where movies.id = ? and episodes.part=1";
        return new Promise(function (resolve, reject) {
            db.query(sql, [id], function (err, result) {
                if (err) {
                    return reject(err)
                } else {
                    return resolve(result[0])
                }
            })
        });
    },
    searchAllMovies: async function (query, page, size) {
        var soitem = size;
        var sophantu = (page - 1) * soitem;
        var byTitle = "select id from movies where REPLACE(title,' ','') like N'%" + query + "%'";
        var byGenres = "select movies.id from ((movies_genres inner join movies on movies.id = movies_genres.id_movie) inner join genres on genres.id = movies_genres.id_genre) where REPLACE(genres.name_genre,' ','') like N'%" + query + "%'";
        var byNamePeople = "select movies.id FROM ((movies_people INNER JOIN movies ON movies.id = movies_people.id_movie) INNER JOIN people ON people.id = movies_people.id_people) where REPLACE(people.name_people,' ','') like N'%" + query + "%'";
        var byOverView = "select id from movies where REPLACE(overview,' ','') like N'%" + query + "%'";
        var sql = "select * from movies where (id in (" + byTitle + ") or id in (" + byNamePeople + ") or id in (" + byOverView + ") or id in (" + byGenres + ")) limit " + sophantu + "," + soitem;
        return new Promise(function (resolve, reject) {
            db.query(sql, [query], function (err, result) {
                if (err) {
                    return reject(err)
                } else {
                    return resolve(result)
                }
            })
        });
    },
    getRelatedMovies: async function (idMovie, Genres, Peoples, page, size) {
        var soitem = size;
        var sophantu = (page - 1) * soitem;
        var byGenres = "select movies.id from ((movies_genres inner join movies on movies.id = movies_genres.id_movie) inner join genres on genres.id = movies_genres.id_genre) where genres.id in (" + Genres + ") ";
        var byPeoples = "select movies.id from ((movies_people inner join movies on movies.id = movies_people.id_movie) inner join people on people.id = movies_people.id_people) where people.id in (" + Peoples + ") ";
        var sql = "select * from movies where (id in (" + byPeoples + ") or id in (" + byGenres + ")) and id != " + idMovie + " limit " + sophantu + "," + soitem;
        return new Promise(function (resolve, reject) {
            db.query(sql.split("undefined").join("null"), [idMovie, Genres, Peoples], function (err, result) {
                if (err) {
                    return reject(err)
                } else {
                    return resolve(result)
                }
            })
        });
    },
    getHistoryOrLikeMovies: async function (key, page, size) {
        var soitem = size;
        var sophantu = (page - 1) * soitem;
        var sql = "SELECT movies.id, movies.title, movies.title_en, movies.overview, movies.poster_path, movies.backdrop_path, movies.rating" +
            " FROM ((history_favorite INNER JOIN movies ON movies.id = history_favorite.id_movie) " +
            "INNER JOIN user ON user.id = history_favorite.id_user) " +
            "where history_favorite.key_check= " + key + " limit " + sophantu + "," + soitem;
        return new Promise(function (resolve, reject) {
            db.query(sql.split("undefined").join("null"), [key], function (err, result) {
                if (err) {
                    return reject(err)
                } else {
                    return resolve(result)
                }
            })
        });
    },
    insertHistoryOrLikeMovies: async function (idMovie, idUser, Key) {
        var insertData = "insert into history_favorite values (null,DATE(CURRENT_TIMESTAMP),?,?,?)";
        var updateData = "update history_favorite set history_favorite.date_save = DATE(CURRENT_TIMESTAMP) where history_favorite.id = ?";
        var checkExist = "select * from history_favorite where id_movie = ? and id_user =? and key_check= ?";
        return new Promise(function (resolve, reject) {
            db.query(checkExist.split("undefined").join("null"), [idMovie, idUser, Key], function (err, result) {
                if (err) {
                    return reject(err)
                } else {
                    if (result.length > 0) {
                        db.query(updateData.split("undefined").join("null"), [result[0].id], function (err, result) {
                            if (err) {
                                return reject(err)
                            } else {
                                return resolve(result)
                            }
                        });
                    } else {
                        db.query(insertData.split("undefined").join("null"), [idMovie, idUser, Key], function (err, result) {
                            if (err) {
                                return reject(err)
                            } else {
                                return resolve(result)
                            }
                        });
                    }
                }
            })
        });
    },
    deleteHistoryOrLike: async function (id) {
        var deleteData = "delete from history_favorite where history_favorite.id_movie = ? and key_check = 2";
        return new Promise(function (resolve, reject) {
            db.query(deleteData.split("undefined").join("null"), [id], function (err, result) {
                if (err) {
                    return reject({success: false, data: [], message: err})
                } else {
                    return resolve({success: true, data: result, message: "UNLIKE_SUCCESSFUL"})
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
module.exports = Movies;