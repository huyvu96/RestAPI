const express = require('express');
const Movies = require('../Models/Movies');
const Category = require('../Models/Category');
const Channel = require('../Models/Channel');
const People = require('../Models/People');
const Genres = require('../Models/Genres');
const Language = require('../Models/Language');
const Episodes = require('../Models/Episodes');
const jwt = require('jsonwebtoken');
const cmd = require('node-cmd');
const global = require('../global');
const router = express.Router();
const crypto = require('crypto');
var user = "HuyVu";
var token = jwt.sign(user, 'vu');

router.get('/detail?', global.verifyToken, async function (req, res, next) {
    const {id} = req.query;
    jwt.verify(req.token, 'tvsea', async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            try {
                let genres = await Genres.getGenresByIdMovies(id);
                let actor = await People.getActorByIdMovies(id);
                let director = await People.getDirectorByIdMovies(id);
                let language = await Language.getLanguageByIdMovies(id);
                let episodes = await Episodes.getAllEpisodesbyIdMovie(id);
                let info = await Movies.getInforByIdMovies(id);
                let related = await Movies.getRelatedMovies(id, global.convertItemArray(genres), global.convertItemArray(actor), 1, 10);
                let comment = await Movies.getCommentMovies(id, 1, 5);
                return res.status(200).json({
                    id_movie: id,
                    success: true,
                    data: {
                        info,
                        actor,
                        director,
                        language,
                        genres,
                        episodes,
                        related,
                        comment
                    },
                });
            } catch (e) {
                return res.status(404).json({
                    id_movie: id,
                    success: false,
                    data: {},
                    message: e.sqlMessage,
                });
            }
        }
    });
});
router.get('/category?', global.verifyToken, async function (req, res, next) {
    let data = [];
    let {page, size, category} = req.query;
    if (!page || !size) {
        page = 1;
        size = 10;
        category = 1
    }
    jwt.verify(req.token, 'tvsea', async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            try {
                data = await Category.getAllMoviesbyCategory(category, page, size);
                return res.status(200).json({
                    category: category,
                    success: true,
                    data,
                    message: "GET_DATA_SUCCESSFUL",
                    page: parseInt(page),
                    size: parseInt(size),
                });
            } catch (e) {
                return res.status(404).json({
                    category: category,
                    success: false,
                    data: [],
                    message: e.sqlMessage,
                    page: parseInt(page),
                    size: parseInt(size),
                });
            }
        }
    });
});
router.get('/top?', global.verifyToken, async function (req, res, next) {
    let data = [];
    let {page, size, category} = req.query;
    if (!page || !size) {
        page = 1;
        size = 5;
        category = 'Phim le'
    }
    jwt.verify(req.token, 'tvsea', async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            try {
                data = await Category.getTopMoviesbyCategory(category, page, size);
                return res.status(200).json({
                    category: category,
                    success: true,
                    data,
                    message: "GET_DATA_SUCCESSFUL",
                    page: parseInt(page),
                    size: parseInt(size),
                });
            } catch (e) {
                return res.status(404).json({
                    category: category,
                    success: false,
                    data: [],
                    message: e.sqlMessage,
                    page: parseInt(page),
                    size: parseInt(size),
                });
            }
        }
    });
});
router.get('/people?', global.verifyToken, async function (req, res, next) {
    let data = [];
    let {page, size, id} = req.query;
    if (!page || !size) {
        page = 1;
        size = 10;
    }
    jwt.verify(req.token, 'tvsea', async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            try {
                data = await People.getAllMoviesbyActor(id, page, size);
                return res.status(200).json({
                    success: true,
                    data,
                    message: "GET_DATA_SUCCESSFUL",
                    page: parseInt(page),
                    size: parseInt(size),
                });
            } catch (e) {
                return res.status(404).json({
                    success: false,
                    data: [],
                    message: e.sqlMessage,
                    page: parseInt(page),
                    size: parseInt(size),
                });
            }
        }
    });
});
router.get('/genres?', global.verifyToken, async function (req, res, next) {
    let data = [];
    let {page, size, id} = req.query;
    if (!page || !size) {
        page = 1;
        size = 10;
    }
    jwt.verify(req.token, 'tvsea', async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            try {
                data = await Genres.getAllMoviebyGenres(id, page, size);
                return res.status(200).json({
                    success: true,
                    data,
                    message: "GET_DATA_SUCCESSFUL",
                    page: parseInt(page),
                    size: parseInt(size),
                });
            } catch (e) {
                return res.status(404).json({
                    success: false,
                    data: [],
                    message: e.sqlMessage,
                    page: parseInt(page),
                    size: parseInt(size),
                });
            }
        }
    });

});
router.get('/search?', global.verifyToken, async function (req, res, next) {
    let data = [];
    let {page, size, query} = req.query;
    if (!page || !size) {
        page = 1;
        size = 10;
    }
    jwt.verify(req.token, 'tvsea', async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            try {
                data = await Movies.searchAllMovies(query, page, size);
                return res.status(200).json({
                    search: query,
                    success: true,
                    data,
                    message: "GET_DATA_SUCCESSFUL",
                    page: parseInt(page),
                    size: parseInt(size),
                });
            } catch (e) {
                return res.status(404).json({
                    search: query,
                    success: false,
                    data: [],
                    message: e.sqlMessage,
                    page: parseInt(page),
                    size: parseInt(size),
                });
            }
        }
    });

});
router.get('/genres/total?', global.verifyToken, async function (req, res, next) {
    let data = [];
    let {page, size} = req.query;
    if (!page || !size) {
        page = 1;
        size = 5;
    }
    jwt.verify(req.token, 'tvsea', async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            try {
                data = await Genres.getAllGenres(page, size);
                return res.status(200).json({
                    success: true,
                    data,
                    message: "GET_DATA_SUCCESSFUL",
                    page: parseInt(page),
                    size: parseInt(size),
                });
            } catch (e) {
                return res.status(403).json({
                    success: false,
                    data: [],
                    message: e.sqlMessage,
                    page: parseInt(page),
                    size: parseInt(size),
                });
            }
        }
    });

});
router.get('/related', global.verifyToken, async function (req, res, next) {
    let data = [];
    let {page, size, idMovie} = req.query;
    if (!page || !size) {
        page = 1;
        size = 5;
    }
    jwt.verify(req.token, 'tvsea', async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            try {
                let genres = await Genres.getGenresByIdMovies(idMovie);
                let actor = await People.getActorByIdMovies(idMovie);
                data = await Movies.getRelatedMovies(idMovie, global.convertItemArray(genres), global.convertItemArray(actor), page, size);
                //await Movies.getRelatedMovies(idMovie, Genres, Peoples, page, size);
                return res.status(200).json({
                    success: true,
                    data,
                    message: "GET_DATA_SUCCESSFUL",
                    page: parseInt(page),
                    size: parseInt(size),
                });
            } catch (e) {
                return res.status(404).json({
                    success: false,
                    data: [],
                    message: e.sqlMessage,
                    page: parseInt(page),
                    size: parseInt(size),
                });
            }
        }
    });
});
router.get('/history', global.verifyToken, async function (req, res, next) {
    let data = [];
    let {page, size, key, id} = req.query;
    key = 1;
    if (!page || !size) {
        page = 1;
        size = 5;
    }
    jwt.verify(req.token, 'tvsea', async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            try {
                data = await Movies.getHistoryOrLikeMovies(id, key, page, size);
                return res.status(200).json({
                    success: true,
                    data,
                    message: "GET_DATA_SUCCESSFUL",
                    page: parseInt(page),
                    size: parseInt(size),
                });
            } catch (e) {
                return res.status(404).json({
                    success: false,
                    data: [],
                    message: e.sqlMessage,
                    page: parseInt(page),
                    size: parseInt(size),
                });
            }
        }
    });
});
router.get('/like', global.verifyToken, async function (req, res, next) {
    let data = [];
    let {page, size, key, id} = req.query;
    key = 2;
    if (!page || !size) {
        page = 1;
        size = 5;
    }
    jwt.verify(req.token, 'tvsea', async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            try {
                data = await Movies.getHistoryOrLikeMovies(id, key, page, size);
                return res.status(200).json({
                    success: true,
                    data,
                    message: "GET_DATA_SUCCESSFUL",
                    page: parseInt(page),
                    size: parseInt(size),
                });
            } catch (e) {
                return res.status(404).json({
                    success: false,
                    data: [],
                    message: e.sqlMessage,
                    page: parseInt(page),
                    size: parseInt(size),
                });
            }
        }
    });

});
router.get('/watchlist', global.verifyToken, async function (req, res, next) {
    let data = [];
    let {page, size, key, id} = req.query;
    key = 3;
    if (!page || !size) {
        page = 1;
        size = 5;
    }
    jwt.verify(req.token, 'tvsea', async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            try {
                data = await Movies.getHistoryOrLikeMovies(id, key, page, size);
                return res.status(200).json({
                    success: true,
                    data,
                    message: "GET_DATA_SUCCESSFUL",
                    page: parseInt(page),
                    size: parseInt(size),
                });
            } catch (e) {
                return res.status(404).json({
                    success: false,
                    data: [],
                    message: e.sqlMessage,
                    page: parseInt(page),
                    size: parseInt(size),
                });
            }
        }
    });

});
router.get('/start-stream?', async function (req, res, next) {
    let {host,path} = req.query;
    try {
        //let path = "https://firebasestorage.googleapis.com/v0/b/livestreaming-46229.appspot.com/o/guardians2.mp4?alt=media&token=eb9467c6-6f16-475c-b541-14342103dce7";
        let duration = await global.getDuration(path);
        global.startStreamming(path);
        return res.status(200).json({
            success: true,
            host,
            path,
            duration,
            message: "STREAMING_SUCCESSFUL",
        });
    } catch (e) {
        return res.status(404).json({
            success: false,
            message: e,
        });
    }
});
router.post('/insertHistoryOrLike?', global.verifyToken, async function (req, res, next) {
    const {idMovie, Key, idUser} = req.body;
    let data = {
        idMovie,
        Key,
        idUser
    };
    jwt.verify(req.token, 'tvsea', async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            try {
                Movies.insertHistoryOrLikeMovies(idMovie, idUser, Key).then((e) => {
                    return res.status(200).json({
                        success: true,
                        data,
                        message: "INSERT_DATA_SUCCESSFUL",
                    });
                });
            } catch (e) {
                return res.status(404).json({
                    success: false,
                    message: e.sqlMessage,
                });
            }
        }
    });
});
router.put('/removeMovie?', global.verifyToken, async function (req, res, next) {
    //Key = 1 History, Key = 2 Like, Key = 3 WatchList;
    const {idUser, idMovie, Key} = req.body;
    jwt.verify(req.token, 'tvsea', async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            try {
                Movies.deleteHistoryOrLike(idUser, idMovie, Key).then((e) => {
                    return res.status(200).json({
                        success: e.success,
                        data: e.data,
                        message: e.message,
                    });
                });
            } catch (e) {
                return res.status(404).json({
                    success: false,
                    message: e.sqlMessage,
                });
            }
        }
    });
});
router.get('/comment', global.verifyToken, async function (req, res, next) {
    let data = [];
    let {page, size, id} = req.query;
    if (!page || !size) {
        page = 1;
        size = 5;
    }
    jwt.verify(req.token, 'tvsea', async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            try {
                data = await Movies.getCommentMovies(id, page, size);
                return res.status(200).json({
                    success: true,
                    data,
                    message: "GET_DATA_SUCCESSFUL",
                    page: parseInt(page),
                    size: parseInt(size),
                });
            } catch (e) {
                return res.status(404).json({
                    success: false,
                    data: [],
                    message: e.sqlMessage,
                    page: parseInt(page),
                    size: parseInt(size),
                });
            }
        }
    });
});
router.post('/insertComment?', global.verifyToken, async function (req, res, next) {
    const {comment, idMovie, idUser, rate} = req.body;
    let data = {
        comment,
        rate,
        idMovie,
        idUser
    };
    jwt.verify(req.token, 'tvsea', async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            try {
                Movies.insertCommentMovies(comment, rate, idMovie, idUser).then((e) => {
                    return res.status(200).json({
                        success: true,
                        data,
                        message: "INSERT_DATA_SUCCESSFUL",
                    });
                });
            } catch (e) {
                return res.status(404).json({
                    success: false,
                    message: e.sqlMessage,
                });
            }
        }
    });
});
router.put('/removeComment?', global.verifyToken, async function (req, res, next) {
    //Key = 1 History, Key = 2 Like;
    const {idUser, idMovie} = req.body;
    jwt.verify(req.token, 'tvsea', async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            try {
                Movies.deleteComment(idUser, idMovie).then((e) => {
                    return res.status(200).json({
                        success: e.success,
                        data: e.data,
                        message: e.message,
                    });
                });
            } catch (e) {
                return res.status(404).json({
                    success: false,
                    message: e.sqlMessage,
                });
            }
        }
    });
});
router.get('/createToken?', async function (req, res, next) {
    const user = {
        id: 1,
        email: "huyvu0505@gmail.com",
        pass: "1234567"
    };
    let token = await global.createToken(user);
    try {
        return res.status(200).json({
            success: true,
            token
        });
    } catch (e) {
        return res.status(404).json({
            success: false,
            message: e.sqlMessage,
        });
    }
});
router.get('/channel', global.verifyToken, async function (req, res, next) {
    let data = [];
    jwt.verify(req.token, 'tvsea', async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            try {
                data = await Channel.getAllChannel();
                return res.status(200).json({
                    success: true,
                    data,
                    message: "GET_DATA_SUCCESSFUL",
                });
            } catch (e) {
                return res.status(404).json({
                    success: false,
                    data: [],
                    message: e.sqlMessage,
                });
            }
        }
    });
});
router.get('/calender', global.verifyToken, async function (req, res, next) {
    let data = [];
    jwt.verify(req.token, 'tvsea', async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            try {
                data = await Channel.getCalenderByChannel();
                return res.status(200).json({
                    success: true,
                    data,
                    message: "GET_DATA_SUCCESSFUL",
                });
            } catch (e) {
                return res.status(404).json({
                    success: false,
                    data: [],
                    message: e.sqlMessage,
                });
            }
        }
    });
});
// var tokenHeader = req.headers.authorization;
// jwt.verify(tokenHeader, 'vu', async function (err, decode) {
//     if (err) {
//         res.send({
//             error: 'Lỗi'
//         })
//     } else {
//         var informovies = await Movies.getAllMoviesbyCategory(req.query.page, req.query.category);
//         var send = {
//             category: req.query.category,
//             informovies: informovies
//         }
//         res.json(informovies);
//     }
// });
// router.get('/genres/total?',global.verifyToken, async function (req, res, next) {
//     let data = [];
//     let {page, size} = req.query;
//     if (!page || !size) {
//         page = 1;
//         size = 5;
//     }
//     jwt.verify(req.token, 'tvsea', async (err, authData) => {
//         if(err) {
//             res.sendStatus(403);
//         } else {
//             try {
//                 data = await Genres.getAllGenres(page, size);
//                 return res.status(200).json({
//                     success: true,
//                     data,
//                     message: "GET_DATA_SUCCESSFUL",
//                     page: parseInt(page),
//                     size: parseInt(size),
//                 });
//             } catch (e) {
//                 return res.status(404).json({
//                     success: false,
//                     data: [],
//                     message: e.sqlMessage,
//                     page: parseInt(page),
//                     size: parseInt(size),
//                 });
//             }
//         }
//     });
// });
module.exports = router;