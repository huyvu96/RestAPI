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
app.use('/user',routesUser);
app.use('/images/movies', express.static('images'));

let server = app.listen(process.env.PORT || 8080, function () {
    console.log('Server listening on port ' + server.address().port);
});
const jobBackground = new cron.CronJob('0 */1 * * * *', async function () { // 1 phút 1 lần
    let movies = await Channel.checkExist();
    if(movies.length > 1){//Ton tai
        let currentTime = await global.convertTimeToSecond(global.getDateTime());
        let timeOfMoviewStreaming = await global.convertTimeToSecond(movies[0].time);
        if(currentTime > timeOfMoviewStreaming){//Xet thoi gian hien tai > time phan tu thu [0] hay khong
            let url_link = await Episodes.getAllEpisodesbyIdMovie(movies[1].id_movie)[0].url_link;//Lay URL phim ke tiep
            cmd.get(`killall ffmpeg`);//Huy lenh
            global.startStreamming(url_link);//Streaming phim tiep theo
            Channel.deleteMovie(movies[0].id_movie);//Delete phim truoc do
        }
    }else if(movies.length === 1) {
        let currentTime = await global.convertTimeToSecond(global.getDateTime());
        let timeOfMoviewStreaming = await global.convertTimeToSecond(movies[0].time);
        if(currentTime > timeOfMoviewStreaming){//Xet thoi gian hien tai > time phan tu thu [0] hay khong
            let url_link = await Episodes.getAllEpisodesbyIdMovie(movies[0].id_movie)[0].url_link;//Lay URL phim ke tiep
            cmd.get(`killall ffmpeg`);//Huy lenh
            global.startStreamming(url_link);//Streaming phim tiep theo
            Channel.deleteMovie(movies[0].id_movie);//Delete phim truoc do
        }
    }
});
jobBackground.start();
module.exports = app;