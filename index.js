const express = require('express');
const bodyparser = require('body-parser');
const routesMovie = require('./Routers/routerMovies');
const routesUser = require('./Routers/routerUser');
const swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');
let app = express();
const cron = require('cron');
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
const Channel = require('./Models/Channel');
const Episodes = require('./Models/Episodes');
const global = require('./global');
const cmd = require("node-cmd");


app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/movies', routesMovie);
app.use('/user', routesUser);
app.use('/images/movies', express.static('images'));

let server = app.listen(process.env.PORT || 8080, function () {
    console.log('Server listening on port ' + server.address().port);
});
const jobBackground = new cron.CronJob('0 */10 * * * * *', async function () { // 1 phút 1 lần
    let movies = await Channel.checkExist();
    if (movies.length > 1) {//Ton tai
        let currentTime = await global.convertTimeToSecond(global.getDateTime());
        let timeOfMoviewStreaming = await global.convertTimeToSecond(movies[0].time);
        console.log('Than one item',currentTime, timeOfMoviewStreaming);
        if (currentTime > timeOfMoviewStreaming) {//Xet thoi gian hien tai > time phan tu thu [0] hay khong
            let episodes = await Episodes.getAllEpisodesbyIdMovie(movies[1].id_movie);
            let url_link = await episodes[0].url_link;//Lay URL phim ke tiep
            cmd.get(`killall ffmpeg`);//Huy lenh
            let timeOutStream = setTimeout(() =>{
                timeOutStream = null;
                clearTimeout(timeOutStream);
                console.log('start streaming');
                global.startStreamming(url_link);//Streaming phim tiep theo
            },5000);
            console.log('delete movie:', movies[0].id_movie);
            Channel.deleteMovie(movies[0].id_movie);//Delete phim truoc do
        }
    }
    else if (movies.length === 1) {
        console.log('delete movie:', movies[0].id_movie);
        Channel.deleteMovie(movies[0].id_movie);//Delete phim truoc do
        // let currentTime = await global.convertTimeToSecond(global.getDateTime());
        // let timeOfMoviewStreaming = await global.convertTimeToSecond(movies[0].time);
        // console.log('Has one item', currentTime, timeOfMoviewStreaming);
        // if (currentTime > timeOfMoviewStreaming) {//Xet thoi gian hien tai > time phan tu thu [0] hay khong
        //     let episodes = await Episodes.getAllEpisodesbyIdMovie(movies[0].id_movie);
        //     let url_link = await episodes[0].url_link;//Lay URL phim ke tiep
        //     console.log('delete movie:', movies[0].id_movie);
        //     Channel.deleteMovie(movies[0].id_movie);//Delete phim truoc do
        //     cmd.get(`killall ffmpeg`);//Huy lenh
        //     let timeOutStream = setTimeout(() =>{
        //         timeOutStream = null;
        //         clearTimeout(timeOutStream);
        //         console.log('start streaming');
        //         global.startStreamming(url_link);//Streaming phim tiep theo
        //     },5000);
        // }
    }
});
jobBackground.start();
module.exports = app;