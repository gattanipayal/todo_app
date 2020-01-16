var mongoose=require("mongoose"),
	passportLocalMongoose=require("passport-local-mongoose");

var userSchema=new mongoose.Schema({
	username:{type:String,required:true},
	email:{type:String,match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],required:true},
	password:String,
	todolist:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"Todo"
	}]
});

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchema);



