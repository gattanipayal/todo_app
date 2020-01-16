var express=require("express"),
	app=express(),
	bodyParser=require("body-parser"),
	mongoose=require("mongoose"),
	passport=require("passport"),
	localStrategy=require("passport-local"),
	User=require("./models/user"),
	Todo=require("./models/todo");

mongoose.connect("mongodb://localhost/todo_app")
app.use(bodyParser.urlencoded({extended:true,useNewUrlParser: true}));
app.set("view engine","ejs");
app.use(require("express-session")({
	secret:"hi there",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	next();
});


app.get("/",function(req,res){
	res.render("home");
});

app.get("/todos",function(req,res){
	User.findById(req.user.id,function(err,foundUser){
		if(err){
			console.log(err);
		}else{
			res.render("todos",{todolist:foundUser.todolist});
		}
	});
});

app.get("/add",function(req,res){
	res.render("add");
});

app.post("/addTodo",function(req,res){
	var newT=new Todo({
		title:req.body.title,
		due_date:req.body.duedate
	});
	User.findById(req.user.id,function(err,foundUser){
		if(err){
			console.log(err);
		}else{
			Todo.create(newT,function(err,newTodo){
				if(err){
					console.log(err);
				}else{
					foundUser.todolist.push(newTodo);
					foundUser.save();
					res.render("todos",{todolist:foundUser.todolist});
				}
			});
		}
	});
});

app.get("/done/:id",function(req,res){
	Todo.findById(req.params.id,function(err,foundTodo){
		if(err){
			console.log(err);
		}else{
			foundTodo.completed=true;
		}
	});
	res.render("todos");
});

app.get("/delete/:id",function(req,res){
	Todo.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/todos");
		}
	});
	res.render("todos");
});

///auth routes

app.get("/register",function(req,res){
	res.render("register");
});

app.post("/register",function(req,res){
	var newUser=new User(
	{
		username:req.body.username, 
		email:req.body.email
	});
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/todos");
		});
	});
});

app.get("/login",function(req,res){
	res.render("login");
});

app.post("/login",passport.authenticate("local",
	{
		successRedirect:"/todos",
		failureRedirect:"/login"
	}),function(req,res){
});

app.get("/logout",function(req,res){
	req.logout();
	res.redirect('/');
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}


app.listen(3000,function(){
	console.log("Server has started!!");
});

