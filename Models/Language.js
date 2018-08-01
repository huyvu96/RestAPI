var db = require('../Dbconnection');

var Language={
    getLanguageByIdMovies:async function(id){
        var sql = "SELECT languages.id, languages.name_language \n \
        FROM ((movies_languages \n \
        INNER JOIN movies ON movies.id = movies_languages.id_movie) \n \
        INNER JOIN languages ON languages.id = movies_languages.id_language) where movies.id=?";
        return new Promise(function (resolve, reject)
        {
            db.query(sql, [id], function (err, result)
            {
                if (err)
                {
                    reject(err)
                } else
                {
                    //console.log(result);
                    resolve(result)
                }
            })
        });
    },
};
 module.exports=Language;