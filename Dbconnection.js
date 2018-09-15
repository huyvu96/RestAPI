var mysql=require('mysql');
var connection=mysql.createPool({
 
host:'us-cdbr-iron-east-01.cleardb.net',
 user:'bec9f36fa86b24',
 password:'5336eb62',
 database:'heroku_fc704c2413ca091',
 port:'3306'
 
});
module.exports=connection;