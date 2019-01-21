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
        var byTitle = "select id from movies where title like N'%" + query + "%'";
        var byTitle_en = "select id from movies where title_en like N'%" + query + "%'";
        //var byGenres = "select movies.id from ((movies_genres inner join movies on movies.id = movies_genres.id_movie) inner join genres on genres.id = movies_genres.id_genre) where REPLACE(genres.name_genre,' ','') like N'%" + query + "%'";
        var byGenres = "select movies.id from ((movies_genres inner join movies on movies.id = movies_genres.id_movie) inner join genres on genres.id = movies_genres.id_genre) where MATCH(genres.name_genre) AGAINST('"+query+"' IN NATURAL LANGUAGE MODE)";
        //var byNamePeople = "select movies.id FROM ((movies_people INNER JOIN movies ON movies.id = movies_people.id_movie) INNER JOIN people ON people.id = movies_people.id_people) where REPLACE(people.name_people,' ','') like N'%" + query + "%'";
        var byNamePeople = " select movies.id FROM ((movies_people INNER JOIN movies ON movies.id = movies_people.id_movie) INNER JOIN people ON people.id = movies_people.id_people) where MATCH(people.name_people) AGAINST('"+query+"' IN NATURAL LANGUAGE MODE)";
        //var byOverView = "select id from movies where REPLACE(overview,' ','') like N'%" + query + "%'";
        var byOverView = "select movies.id from movies where match(overview) against('" + query + "' IN NATURAL LANGUAGE MODE)";

        var sql = "select * from movies where (id in (" + byTitle + ") or id in (" + byTitle_en + ") or id in (" + byNamePeople + ") or id in (" + byOverView + ") or id in (" + byGenres + ")) limit " + sophantu + "," + soitem;
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
        var sql = "select * from movies where (id in (" + byPeoples + ") or id in (" + byGenres + ")) and id != " + idMovie + " ORDER BY rand() limit " + sophantu + "," + soitem;
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
    getHistoryOrLikeMovies: async function (id, key, page, size) {
        var soitem = size;
        var sophantu = (page - 1) * soitem;
        var sql = "SELECT movies.id, movies.title, movies.title_en, movies.overview, movies.poster_path, movies.backdrop_path, movies.rating,history_favorite.date_save" +
            " FROM ((history_favorite INNER JOIN movies ON movies.id = history_favorite.id_movie) " +
            "INNER JOIN user ON user.id = history_favorite.id_user) " +
            "where history_favorite.id_user =" + id + " and history_favorite.key_check= " + key + " ORDER BY history_favorite.date_save DESC limit " + sophantu + "," + soitem;
        return new Promise(function (resolve, reject) {
            db.query(sql.split("undefined").join("null"), [id, key], function (err, result) {
                if (err) {
                    return reject(err)
                } else {
                    return resolve(result)
                }
            })
        });
    },
    insertHistoryOrLikeMovies: async function (idMovie, idUser, Key) {
        var insertData = "insert into history_favorite values (null,CURRENT_TIMESTAMP,?,?,?)";
        var updateData = "update history_favorite set history_favorite.date_save = CURRENT_TIMESTAMP where history_favorite.id = ?";
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
    deleteHistoryOrLike: async function (idUser, idMovie, Key) {
        //Key = 1 History, Key = 2 Like;
        var deleteData = "delete from history_favorite where id_user = ? and id_movie = ? and key_check = ?";
        return new Promise(function (resolve, reject) {
            db.query(deleteData.split("undefined").join("null"), [idUser, idMovie, Key], function (err, result) {
                if (err) {
                    return reject({success: false, data: [], message: err})
                } else {
                    return resolve({success: true, data: result, message: "DELETE_SUCCESSFUL"})
                }
            })
        });
    },
    getCommentMovies: async function (id, page, size) {
        var soitem = size;
        var sophantu = (page - 1) * soitem;
        var sql = "select comment.id, movies.id as id_movie, user.id as id_user, user.display_name, user.url_avatar, comment.comment, comment.date, comment.rate " +
            "FROM ((comment INNER JOIN movies ON movies.id = comment.id_movie) " +
            "INNER JOIN user ON user.id = comment.id_user)" +
            " where movies.id = ? ORDER BY comment.date DESC limit " + sophantu + "," + soitem;
        return new Promise(function (resolve, reject) {
            db.query(sql.split("undefined").join("null"), [id], function (err, result) {
                if (err) {
                    return reject(err)
                } else {
                    return resolve(result)
                }
            })
        });
    },
    insertCommentMovies: async function (comment, rate, idMovie, idUser) {
        var insertData = "insert into comment values (null,?,?,CURRENT_TIMESTAMP,?,?)";
        var updateData = "update comment set comment.comment = ?, comment.rate = ? where comment.id = ?";
        var checkExist = "select * from comment where id_movie = ? and id_user =?";
        return new Promise(function (resolve, reject) {
            db.query(checkExist.split("undefined").join("null"), [idMovie, idUser], function (err, result) {
                if (err) {
                    return reject(err)
                } else {
                    if (result.length > 0) {
                        db.query(updateData.split("undefined").join("null"), [comment, rate, result[0].id], function (err, result) {
                            if (err) {
                                return reject(err)
                            } else {
                                return resolve(result)
                            }
                        });
                    } else {
                        db.query(insertData.split("undefined").join("null"), [comment, rate, idMovie, idUser], function (err, result) {
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
    deleteComment: async function (idUser, idMovie) {
        //Key = 1 History, Key = 2 Like;
        var deleteData = "delete from comment where  id_user = ? and id_movie = ?";
        return new Promise(function (resolve, reject) {
            db.query(deleteData.split("undefined").join("null"), [idUser, idMovie], function (err, result) {
                if (err) {
                    return reject({success: false, data: [], message: err})
                } else {
                    return resolve({success: true, data: result, message: "DELETE_SUCCESSFUL"})
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