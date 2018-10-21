const express = require('express');
const bodyparser = require('body-parser');
const routesMovie = require('./Routers/routerMovies');
const routesUser = require('./Routers/routerUser');
const swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');
let app = express();

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/movies', routesMovie);
app.use('/user',routesUser);
app.use('/images/movies', express.static('images'));

let server = app.listen(process.env.PORT || 3000, function () {
    console.log('Server listening on port ' + server.address().port);
});
module.exports = app;