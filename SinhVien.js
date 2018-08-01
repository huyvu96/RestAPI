var db = require('./Dbconnection');

var SinhVien={
	getAllSinhVien:function(trang,callback){
		var soitem ="10";
		var sophantu =(trang-1) * soitem;
		console.log(trang)
		return db.query("Select * from movies limit "+sophantu+","+soitem,callback);
	},
	// getSinhVienById:function(id,callback){
	// 	return db.query("select * from movies where Id=?",[id],callback);
	// },
	// addSV:function(sinhvien,callback){
	// 	return db.query("Insert into movies(name,class,dob) values(?,?,?)",[sinhvien.name,sinhvien.class,sinhvien.dob],callback);
	// },
	// deleteSV:function(id,callback){
	// 	return db.query("delete from movies where Id=?",[id],callback);
	// },
	// updateSV:function(id,sinhvien,callback){
	// 	return db.query("update movies set name=?,class=?,dob=? where Id=?",[sinhvien.name,sinhvien.class,sinhvien.dob,id],callback);
	// }
};
 module.exports=SinhVien;