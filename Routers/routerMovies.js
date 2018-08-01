var express = require('express');
var router = express.Router();
var Movies = require('../Models/Movies');
var Category = require('../Models/Category');
var People = require('../Models/People');
var Genres = require('../Models/Genres');
var Language = require('../Models/Language');
var Episodes = require('../Models/Episodes');

var db = require('../Dbconnection');
var jwt = require('jsonwebtoken');
var user = "HuyVu";
var token = jwt.sign(user, 'vu');
// token chua de code eyJhbGciOiJIUzI1NiJ9.SHV5VnU.vKmJ7RrenQhO1kM0rGR9e5P-4OS6kzeWO9dpich64vE
router.get('/detail?', async function (req, res, next) {
    var send;
    var genres = await Genres.getGenresByIdMovies(req.query.id);
    var actor = await People.getActorByIdMovies(req.query.id);;
    var director = await People.getDirectorByIdMovies(req.query.id);
    var language = await Language.getLanguageByIdMovies(req.query.id);
    var episodes = await Episodes.getAllEpisodesbyIdMovie(req.query.id);
    var informovie = await Movies.getInforByIdMovies(req.query.id);
    send = {
        informovie: informovie,
        actor: actor,
        director: director,
        language: language,
        genres: genres,
        episodes: episodes
    }
    res.send(send);
});
router.get('/category?',async function (req, res, next) {
    var informovies = await Category.getAllMoviesbyCategory(req.query.page, req.query.category);   
    res.send(informovies);
});
router.get('/topcategory?',async function (req, res, next) {
    var informovies = await Category.getTopMoviesbyCategory(req.query.category);   
    res.send(informovies);
});
router.get('/actor?',async function (req, res, next) {
    var informovies = await People.getAllMoviesbyActor(req.query.page, req.query.actor);   
    res.send(informovies);
    
});
router.get('/genres?',async function (req, res, next) {
    var informovies = await Genres.getAllMoviebyGenres(req.query.id,req.query.name,req.query.page);
    res.send(informovies);    
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
module.exports = router;