import express from 'express';
import bodyparser from 'body-parser';
import routes from './Routers/routerMovies';
import cmd from "node-cmd";
import moment from 'moment'
import fs from 'fs';
import global from './global';
let app = express();

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

app.use('/movies', routes);
app.use('/images/movies', express.static('images'));

let server = app.listen(process.env.PORT || 3000, function () {
    console.log('Server listening on port ' + server.address().port);
});
module.exports = app;