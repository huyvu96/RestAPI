const express = require('express');
const bodyparser = require('body-parser');
const routes = require('./Routers/routerMovies');
let app = express();

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

app.use('/movies', routes);
app.use('/images/movies', express.static('images'));

let server = app.listen(process.env.PORT || 3000, function () {
    console.log('Server listening on port ' + server.address().port);
});
module.exports = app;