var mongoose=require("mongoose");

var todoSchema = new mongoose.Schema({
	title:{
		type:String,
		required:true},
	due_date:{
		type:Date
	},
	completed:Boolean
});

module.exports=mongoose.model("Todo",todoSchema);
