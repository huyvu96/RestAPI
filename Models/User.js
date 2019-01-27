var db = require('../ConnectDatabase/Dbconnection');

var User = {
    signUp: async function (name, email, password) {
        var insertData = "insert into user values(null,?,?,null,null,?,?,1)";
        var checkExist = "select * from user where email = ?";
        var url = "https://firebasestorage.googleapis.com/v0/b/qlnv-f40e8.appspot.com/o/nophoto.png?alt=media&token=2663ae65-8f1c-4828-ab9c-b16cc5fae85b";
        return new Promise(function (resolve, reject) {
            db.query(checkExist.split("undefined").join("null"), [email], function (err, result) {
                if (err) {
                    return reject(err)
                } else {
                    console.log(result);
                    if (result.length <= 0) {
                        db.query(insertData.split("undefined").join("null"), [name, url, email, password], function (err, result) {
                            console.log(err, result);
                            if (err) {
                                return reject({success: false, message: err})
                            } else {
                                return resolve({success: true, data: result, message: "USER_SIGN_UP_SUCCESSFUL"})
                            }
                        });
                    } else {
                        return resolve({success: false, data: [], message: "USER_IS_EXIST"});
                    }
                }
            })
        });
    },
    signIn: async function (email, password) {
        var checkExist = "select * from user where email = ? and password = ?";
        var checkHistory = "SELECT movies.id" +
            " FROM ((history_favorite INNER JOIN movies ON movies.id = history_favorite.id_movie) " +
            "INNER JOIN user ON user.id = history_favorite.id_user) " +
            "where history_favorite.id_user = ? and history_favorite.key_check= 1 ORDER BY history_favorite.date_save DESC limit 1";
        return new Promise(function (resolve, reject) {
            db.query(checkExist.split("undefined").join("null"), [email, password], function (err, result) {
                if (err) {
                    return reject(err)
                } else {
                    if (result.length <= 0) {
                        return resolve({success: false, data: [], message: "USER_SIGN_IN_ERROR"})
                    } else {
                        let data = result[0];
                        db.query(checkHistory.split("undefined").join("null"), [result[0].id], function (err, history) {
                           if(err) {
                               return reject(err)
                           } else {
                               if(history.length > 0){
                                   data = {...data, id_movie_history: history[0].id};
                                   return resolve({success: true, data: data, message: "USER_SIGN_IN_SUCCESSFUL"});
                               }else{
                                   data = {...data, id_movie_history: null};
                                   return resolve({success: true, data: data, message: "USER_SIGN_IN_SUCCESSFUL"});
                               }

                           }
                        });
                    }
                }
            })
        });
    },
    updateInfo: async function (name, url, phone, sex, email, password, type, id) {
        var updateData = "update user set display_name = ?, url_avatar = ?, number_phone = ? , sex = ?, email = ?, password = ?, id_type_user = ? where id = ?";
        var checkExist = "select * from user where email = ?";
        return new Promise(function (resolve, reject) {
            db.query(checkExist.split("undefined").join("null"), [email], function (err, result) {
                if (err) {
                    return reject(err)
                } else {
                    if (result.length > 0) {
                        db.query(updateData.split("undefined").join("null"), [name, url, phone, sex, email, password, type, id], function (err, result) {
                            if (err) {
                                return reject({success: false, message: err})
                            } else {
                                return resolve({success: true, data: result, message: "UPDATE_USER_INFO_SUCCESSFUL"})
                            }
                        });
                    } else {
                        return resolve({success: false, data: [], message: "UPDATE_USER_INFO_ERROR"});
                    }
                }
            })
        });
    },
};
module.exports = User;