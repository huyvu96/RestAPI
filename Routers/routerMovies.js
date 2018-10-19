const express = require('express');
const Movies = require('../Models/Movies');
const Category = require('../Models/Category');
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

router.get('/detail?', async function (req, res, next) {
    try {
        const {id} = req.query;
        let genres = await Genres.getGenresByIdMovies(id);
        let actor = await People.getActorByIdMovies(id);
        let director = await People.getDirectorByIdMovies(id);
        let language = await Language.getLanguageByIdMovies(id);
        let episodes = await Episodes.getAllEpisodesbyIdMovie(id);
        let info = await Movies.getInforByIdMovies(id);
        return res.status(200).json({
            id_movie: id,
            success: true,
            info,
            actor,
            director,
            language,
            genres,
            episodes
        });
    } catch (e) {
        return res.status(404).json({
            message: e.sqlMessage,
        });
    }
});
router.get('/category?', async function (req, res, next) {
    let data = [];
    let {page, size, category} = req.query;
    if (!page || !size) {
        page = 1;
        size = 10;
        category = 'Phim le'
    }
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
});
router.get('/top?', async function (req, res, next) {
    let data = [];
    let {page, size, category} = req.query;
    if (!page || !size) {
        page = 1;
        size = 5;
        category = 'Phim le'
    }
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
});
router.get('/people?', async function (req, res, next) {
    let data = [];
    let {page, size, id} = req.query;
    if (!page || !size) {
        page = 1;
        size = 10;
    }
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
});
router.get('/genres?', async function (req, res, next) {
    let data = [];
    let page = req.query.page;
    let size = req.query.size;
    if (!page || !size) {
        page = 1;
        size = 10;
    }
    try {
        data = await Genres.getAllMoviebyGenres(req.query.id, req.query.name, page, size);
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
});
router.get('/search?', async function (req, res, next) {
    let data = [];
    let {page, size, query} = req.query;
    if (!page || !size) {
        page = 1;
        size = 10;
    }
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
});
router.get('/genres/total?', async function (req, res, next) {
    let data = [];
    let {page, size} = req.query;
    if (!page || !size) {
        page = 1;
        size = 5;
    }
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
});
router.get('/relatedMovies', async function (req, res, next) {
    let data = [];
    let {page, size, idGenre1, idGenre2, idPeople1, idPeople2} = req.query;
    if (!page || !size) {
        page = 1;
        size = 5;
    }
    try {
        data = await Movies.getRelatedMovies(idGenre1, idGenre2, idPeople1, idPeople2, page, size);
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
});
router.get('/history', async function (req, res, next) {
    let data = [];
    let {page, size, key} = req.query;
    key = 1;
    if (!page || !size) {
        page = 1;
        size = 5;
    }
    try {
        data = await Movies.getHistoryOrLikeMovies(key, page, size);
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
});
router.get('/like', async function (req, res, next) {
    let data = [];
    let {page, size, key} = req.query;
    key = 2;
    if (!page || !size) {
        page = 1;
        size = 5;
    }
    try {
        data = await Movies.getHistoryOrLikeMovies(key, page, size);
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
});
router.get('/start-stream?', async function (req, res, next) {
    let {host} = req.query;
    try {
        let path = "https://firebasestorage.googleapis.com/v0/b/livestreaming-46229.appspot.com/o/tranformer5.mp4?alt=media&token=06006234-38c4-465b-87e5-d8adc1efb85f";
        let duration = await global.getDuration(path);
        global.startStreamming(path, host);
        return res.status(200).json({
            success: true,
            host: host,
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
router.post('/createToken?', async function (req, res, next) {
    let user = {
        id: 1,
        email: 'huyvu0505@gmail.com',
        pass: '123456'
    };
    let user_info = req.body.user;
    jwt.sign({user_info}, 'tvsea', (err, token) => {
        return res.status(200).json({
            user_info,
            token
        });
    });
});
router.post('/insertHistoryOrLike?', async function (req, res, next) {
    const {idMovie, Key, idUser} = req.body;
    let data = {
        idMovie,
        Key,
        idUser
    };
    try {
        Movies.insertHistoryOrLikeMovies(idMovie, idUser, Key).then((e) => {
            return res.status(200).json({
                success: true,
                data,
                message: "GET_DATA_SUCCESSFUL",
            });
        });
    } catch (e) {
        return res.status(404).json({
            success: false,
            message: e.sqlMessage,
        });
    }
});
router.put('/unLike?', async function (req, res, next) {
    const {id} = req.body;
    try {
        Movies.deleteHistoryOrLike(id).then((e) => {
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
});// var tokenHeader = req.headers.authorization;
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