/* this code is built off of server.js nov28 - 3pm */
'use strict';
const log = console.log;

const express = require('express')
const port = process.env.PORT || 3000
const bodyParser = require('body-parser') // middleware for parsing HTTP body from client
const session = require('express-session')
const hbs = require('hbs')
const igdb = require('igdb-api-node').default;
//const moment = require('moment')

// ==== Multer - image upload setup ====
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + '/public/resources/images/profile-pictures/')
  },
  filename: function (req, file, cb) {
    cb(null, req.session.viewingUser + '.png')
  }
})
const upload = multer({storage: storage})
// ==== done Multer - image upload setup ====

const { ObjectID } = require('mongodb')

// Import our mongoose connection
const { mongoose } = require('./db/mongoose');

// Import the models
/* const { Student } = require('./models/student')
const { User } = require('./models/user') */
const Models  = require('./models/model')
const User = Models.User
const Post = Models.Post
const Report = Models.Report
const Platform = Models.Platform
const igdb_client = igdb('e5ca32669192cb320e449d73603725d6');

// express
const app = express();
// body-parser middleware setup.  Will parse the JSON and convert to object
app.use(bodyParser.json());
// parse incoming parameters to req.body
app.use(bodyParser.urlencoded({ extended:true }))

// set the view library
app.set('view engine', 'hbs')

//register header partial
hbs.registerPartials(__dirname + "/views/partials")

// static js directory
app.use("/js", express.static(__dirname + '/public/js'))
app.use("/styles", express.static(__dirname + '/public/styles'))
app.use("/resources", express.static(__dirname + '/public/resources'))

// Add express sesssion middleware
app.use(session({
	secret: 'oursecret',
	resave: false,
	saveUninitialized: false,
	cookie: {
		expires: 600000,
		httpOnly: true
	}
}))

// Add middleware to check for logged-in users
const sessionChecker = (req, res, next) => {
	if (req.session.user) {
		res.redirect('home')
	} else {
		next();
	}
}

// Middleware for authentication for resources
const authenticate = (req, res, next) => {
	if (req.session.user) {
		User.findById({_id: req.session.user._id}).then((user) => {
			if (!user) {
				return Promise.reject()
			} else {
				req.user = user
				next()
			}
		}).catch((error) => {
			res.redirect('/login')
		})
	} else {
		res.redirect('/login')
	}
}

// route for root; redirect to home
app.get('/', sessionChecker, (req, res) => {
	res.redirect('/home')
})

// route for login
app.route('/login')
	.get(sessionChecker, (req, res) => {
		res.sendFile(__dirname + '/public/login.html')
	})

//getting a post page (NOT THE JSON, THE ACTUAL WEB PAGE)
app.get('/post/view/:id', authenticate, (req, res) => {
    const id = req.params.id
    if(!ObjectID.isValid(id)) {
        return res.status(404).send("404 NOT FOUND SORRY")
    }


    Post.findById(id)
        .populate('creator')
        .populate('members')
        .then((post) => {

        if(!post) {
            res.status(404).send("404 NOT FOUND SORRY")
        }

        //fixing line breaks
        post.details = post.details.replace(/(?:\r\n|\r|\n)/g, '<br>');

        const formattedLocation = encodeURI(post.meetLocation); //for google map search
        let retObj = {
            user: req.session.user,
            canEdit: false,
            post: post,
            postUrlLocation: formattedLocation
        }

        if(req.session.user.name == post.creator.name || req.session.user.isAdmin) {//these guys can edit parts of the post and add user
            retObj.canEdit = true
            res.render("post_view.hbs", retObj)
        } else {//only members of post can view
            let memNames = post.members.map((member)=>{
                return member.name
            })
            if(memNames.includes(req.session.user.name)) {
                res.render("post_view.hbs", retObj)
            } else {
                return res.status(403).send("YOU DONT HAVE PERMISSION TO ACCESS THIS RESOURCE")
            }
        }
    }).catch((error)=> {
        res.status(400).send(error)
    })

})

//getting a post's edit page
app.get('/post/edit/:id', authenticate, (req, res) => {
    const id = req.params.id
    if(!ObjectID.isValid(id)) {
        return res.status(404).send("404 NOT FOUND SORRY")
    }


    Post.findById(id).populate('creator').then((post) => {


        if(!post) {
            res.status(404).send("404 NOT FOUND SORRY")
        }

        let retObj = {
            user: req.session.user,
            isEdit: true, //so we can recycle the post-edit page as a make-post page
            post: post
        }

        if(req.session.user.name === post.creator.name || req.session.user.isAdmin) {//these guys can edit parts of the post and add user
            res.render("post_edit.hbs", retObj)

        } else {
            return res.status(403).send("YOU DONT HAVE PERMISSION TO ACCESS THIS RESOURCE")
        }
    }).catch((error)=> {
        res.status(400).send(error)
    })

})

//get all posts as json array with items relevant for home page as well as user session info
//changes the creator field of each post their username and their

//profile pic url is added as a field.
//the json
app.get('/posts', (req,res)=>{
	Post.find({isDeleted: false})
    .populate("creator")
    .then((posts)=>{//return only relevant homepage data
        return posts.map((post)=> {

            let relevantHomepagePerPostData = {
                _id: post._id,
                creatorName: post.creator.name,
                creatorProfilePicUrl: post.creator.profilePicUrl,
                date: post.date,
                gameGenres: post.gameGenres,
                gameTitle: post.gameTitle,
                gamePicUrl: post.gamePicUrl,
                totalPlayers: post.playersNeeded,
                platform: post.plaforms,
                gameGenres: post.gameGenres,
                playersCurrentlyIn: post.members.length,
                title: post.title,
                sessionUserName: req.session.user.name,

                waitingForInvite: String(post.inviteReqs).includes(req.session.user._id),
                isSessionUserMember: String(post.members).includes(req.session.user._id)
            }
            console.log(post.inviteReqs);
            console.log(String(post.inviteReqs).includes(String(req.session.user._id)));
            console.log(req.session.user._id);
            return relevantHomepagePerPostData
        })
    }).then((posts) => {
        res.send({
            isSessionUserAdmin: false,
            posts: posts
        })
    }).catch((error)=>{
        res.status(400).send("internal server error?")
    })

})

//creates an invite request by the logged in user to the post
//and returns "success" or "failure" or "post is full"
app.post('/api/invitereq/:post_id/', authenticate,  (req, res)=> {
    const id = req.params.post_id
    Post.findById(id).then((post)=> {
        if(post.members.length >= post.playersNeeded-1) {
            res.status(403).send("post is full")
        } else if(post.members.includes(req.session.user._id)) {
            res.status(403).send("already in")

        } else if(post.inviteReqs.incudes(req.session.user._id)) {
            res.status(403).send("already requested")
        }
        else {
            let inviteReqs = post.inviteReqs
            inviteReqs.push(req.session.user._id)
            post.set({inviteReqs: inviteReqs})
            return post.save()
        }
    }).then((whatevere)=> {
        res.send("success")
    }).catch((error)=> {
        res.status(404).send("failure")
    })
})

//getting a page to make post
app.get('/post/make', authenticate, (req, res) => {
        let retObj = {
            user: req.session.user,
            isEdit: false
        }
        res.render("post_edit.hbs", retObj)
})

//creates a new post, assuming a json body
//that matches the schema ,
//using req.sessionuser for crearor
//This means creator SHOULD NOT be in the request body
app.post('/api/post/create', authenticate, (req, res)=> {
    let templatePost = req.body
    templatePost.creator = req.session.user._id
    const post = new Post(templatePost)
    post.save().then((result)=> {
        res.redirect('/post/view/' + result._id.toString())

    }).catch((error)=>{
        res.status(400).send(error)
    })
})

//this is for postman
app.post('/api/post/createnoauth', (req, res)=> {
    console.log(req.body);
    let templatePost = req.body
    const post = new Post(templatePost)
    post.save().then((result)=> {
        res.redirect('/post/view/' + result._id.toString())
    }).catch((error)=>{
        res.status(400).send(error)
    })
})

//editing a post, assuming json body has all fields
//the ref fields should be OBJECT IDs, use this for editing any part of post
//EXCEPT CREATOR, AND DATE MADE (you can change these, but why would you)
app.patch('/api/post/edit/:id', authenticate, (req, res) => {
    const id = req.params.id
    if(!ObjectID.isValid(id)) {
        return res.status(404).send("404 NOT FOUND SORRY")
    }

    Post.findById(id).then((post) => {

        if(!post) {
            res.status(404).send("404 NOT FOUND SORRY")
        }

        let retObj = {
            user: req.session.user
        }

        if(req.session.user.name === post.creator || req.session.user.isAdmin) {//these guys can edit parts of the post and add user
            post.set(req.body)
            post.save().then( (post) => {res.redirect("/post/view/" + post.id.toString())}
            ).catch((error) => {return res.status(400).send(error)})

        } else {
            return res.status(403).send("YOU DONT HAVE PERMISSION TO ACCESS THIS RESOURCE")
        }
    }).catch((error)=> {
        res.status(400).send(error)
    })

})




//getting a users page (NOT THE JSON, THE ACTUAL WEBPAGE)
app.get('/users/:username', authenticate, (req, res) => {
    const username = req.params.username

    User.findOne({name: username.toLowerCase()}).then((user) => {
        let retObj = {
                user: req.session.user,
                canEdit: false,
                isJustOwner: false ,
                userDetails : user, //header uses the "user" field to display profile pic and link to own profile page, so the details for this page are put in this field instead
                formattedMemberSince: user.memberSince.toISOString().substring(0, 10)
        }

        if(!user) {
            res.status(404).send("404 NOT FOUND SORRY")
        }
        if(req.session.user.isAdmin) {
            retObj.canEdit = true
            retObj.isJustOwner = false //means this guy doesnt ONLY own the username, this is for differences in view for these two(admins dont need to confirm password changes)
        }
        else if(req.session.user.name == username) {//these guys can edit parts of the post and add user
            retObj.canEdit = true
            retObj.isJustOwner = true
        }
        req.session.viewingUser = retObj.userDetails.name// for admin profile pic updating
        console.log(retObj)
        res.render("user_profile.hbs", retObj)

    }).catch((error)=> {
        res.status(404).send("404 NOT FOUND SORRY")
    })

})

//changes user info , isBanned, password, isAdmin must be done by an admin
//expects JSON body, returns editted json of user
app.patch('/api/users/changeInfo/:username', authenticate, (req,res)=> {
        const username = req.params.username
        if(req.sesssion.user.name === username || req.session.user.isAdmin) {
            if((req.hasOwnProperty('isAdmin') ||
            req.hasOwnProperty('isBanned') ||
            req.hasOwnProperty('password')) && !req.session.user.isAdmin) { //ONLY AN ADMIN CAN CHANGE THESE FIELDS with this route
            res.status.send(403).send("NO PERMISSION")
            } else {

                User.findOne({name: req.session.user.name}).then((user)=> {
                user.set(req.body)
                return user.save()
               }).then((user)=>{
                   res.send(user)
               }).catch((error)=>{
                   res.status(400).send("DATABASE PROBLEM")
               })
           }
        } else {
            res.status(403).send("NO PERMISSION")
        }
})

//just expects a password, returns json of user, ignores other fields
//returns user json
app.patch('/api/users/changePassword/:username', authenticate,  (req,res)=> {
    const username = req.params.username
    if(req.sesssion.user.name === username || req.session.user.isAdmin) {
        User.findByNamePassword(username, req.body.password).then((user)=>{
            user.password = req.body.password
            return user.save()
        },
        (error)=>{
            res.status(400).send("wrong password for user")
        }).then((user)=> {
            res.send(user)
        }, (error)=>{
            res.status(400).send("problem with DB")
        })


    } else {
        res.status(403).send("NO PERMISSION")
    }
})

//creates a report, assuming a json body that matches the schema
//expects only  the perpetrator's name  and content, other fields will be overwritten
//sends a json of the report
app.post('/reports/api/create', authenticate, (req, res)=> {
    User.findOne({name: req.body.perpetrator.toLowerCase()}//this is slightly confusing, perpetrator in this context refers to the NAME of the user
    ).then((user)=>{
        let templateReport = req.body
        templateReport.perpetrator = user._id
        return templateReport
    }).then((reportTemplate)=>{
        reportTemplate.date = Date.now()
        reportTemplate.isClosed = false
        const report = new Report(reportTemplate)
        return report.save()
    }).then((report)=>{
        res.send(report)
    }).catch((error)=>{
        res.status(400).send(error)
    })
})

//postman only same as /reports/api/create but no authentication for easy postman test
app.post('/reports/api/createnoauth', (req, res)=> {
    User.findOne({name: req.body.perpetrator.toLowerCase()}//this is slightly confusing, perpetrator in this context refers to the NAME of the user
    ).then((user)=>{
        let templateReport = req.body
        //templateReport.perpetrator = user._id
        return templateReport
    }).then((reportTemplate)=>{
        reportTemplate.date = Date.now()
        reportTemplate.isClosed = false
        const report = new Report(reportTemplate)
        return report.save()
    }).then((report)=>{
        res.send(report)
    }).catch((error)=>{
        res.status(400).send(error)
    })
})

//closes report with id
//expects only  the id, other fields are ignored
//sends a json of the report
app.post('/reports/api/close/:id', authenticate, (req, res)=> {
    const id = req.params.id
    if(req.session.user.isAdmin){
        Report.findById(id).then((report)=>{
           report.set({isClosed:true})
           return report.save()
        }).then((report)=>{
           res.send(report)
        }).catch((error)=>{
            res.status(400).send(error)
        })
    } else {
        res.status(403).send("NO PERMISSION")
    }

})

//Route to get all teh active  reports if you are admin
app.get('/reports', authenticate, (req,res)=> {
    if(req.session.user.isAdmin){
        Report.find({isClosed:false}).sort({date: -1})
        .populate("perpetrator")
        .then((reports)=>{
            res.render("reports.hbs", {
                user: req.session.user,
                headerTitle: "REPORTS",
                reports: reports

            })

        }).catch((error)=>{
            res.status(403).send(error)
        })
    } else {
        res.status(403).send("YOU DONT HAVE PERMISSION")
    }
})

//homepage
app.get('/home', (req, res) => {

	// check if we have active session cookie
	if (req.session.user) {
		//res.sendFile(__dirname + '/public/dashboard.html')
		res.render('homepage.hbs', {
			user:req.session.user,
            headerTitle: "HOME"
		})
	} else {
		res.sendFile(__dirname + '/public/login.html')
	}
})

// User login and logout and creation routes
app.post('/login/start', (req, res) => {
	const name = req.body.name
	const password = req.body.password

	User.findByNamePassword(name, password).then((user) => {
		if(!user) {

			res.redirect('/login')
		} else {
			// Add the user to the session cookie that we will
			// send to the client
            if(user.isBanned) {
                res.status(200).send("Sorry, you are banned")
            }
            else{
                req.session.user = user
                res.redirect('/home')
            }
		}
	}).catch((error) => {
		res.status(400).redirect('/login')
	})
})

//logout route
app.get('/logout', (req, res) => {

	req.session.destroy((error) => {
		if (error) {
            res.status(500).send(error)
		} else {
			res.redirect('/')
		}
	})
})

//get 10 game id and cover from igdb
app.get('/igdb',(req,res)=>{

	igdb_client.games({
		fields:"id,name,cover",
		limit:10,
		filters: {"version_parent-not_exists":1}
	}).then(response=>{
		response.body.sort((a,b)=>{
			let x = a.name.toLowerCase()
			let y = b.name.toLowerCase()
			if(x<y) {return -1}
			if(x>y) {return 1}
		});
		let names =[];
		let ids =[];
		let covers = [];
		response.body.forEach(a=>{
			names.push(a.name);
			console.log(a.name);
			console.log(a.id);
			ids.push(a.id);
			console.log(a.cover);
			let coverURL = "/resources/images/logo.png";
			if (a.cover != null){ //change to big logo if exists
				const cloud_id = a.cover.cloudinary_id
				coverURL = igdb_client.image({cloudinary_id:cloud_id},"cover_big","jpg")
			}
			covers.push(coverURL);
			console.log("what");
		})
		res.send({names:names,ids:ids,covers:covers});

	}).catch(error=>{
		res.status(400).send(error)
	})
})


//get igdb given a name
app.get('/igdb/:name',(req,res)=>{

	igdb_client.games({
		fields:"id,name,cover",
		limit:30,
        order: "popularity:desc",
        search: req.params.name
		// filters: {"name-prefix": req.params.name,
							// "version_parent-not_exists":1}
	}).then(response=>{
		console.log(req.params.name);
		//res.send(response.body)
		response.body.sort((a,b)=>{
			let x = a.name.toLowerCase()
			let y = b.name.toLowerCase()
			if(x<y) {return -1}
			if(x>y) {return 1}
		});
		let names =[];
		let ids =[];
		let covers = [];
		response.body.forEach(a=>{
			names.push(a.name);
			ids.push(a.id);
			let coverURL = "/resources/images/logo.png";
			if (a.cover != null){ //change to big logo if exists
				const cloud_id = a.cover.cloudinary_id
				coverURL = igdb_client.image({cloudinary_id:cloud_id},"cover_big","jpg")
			}
			covers.push(coverURL);
			console.log("what");
		})
		res.send({names:names,ids:ids,covers:covers});

	}).catch(error=>{
		res.status(400).send(error)
	})
})

//we have to pay for this so no need
app.get('/igdball',(req,res)=>{
	igdb_client.scroll('/games/?fields=name&filter[genre][eq]=7&limit=50').then(response => {
		res.send(response.body);
	}).catch(error=>{
		res.status(400).send("error that didnt work")
	});
})

//adds a new comment to a post, only expects the post id in the body
app.post('/api/comments/:post_id',authenticate,(req,res) =>{
  const user = req.session.user._id;
  const content = req.body
  const id = req.params.post_id
  Post.findByIdAndUpdate(id, {$push:{"comments":{date: new Date(),user:user,content:content}}},{new:true}).then((post)=>{
    if(!post){
      res.status(404).send()
    } else{
      res.send({post})
    }
  }).catch((error)=>{
    res.status(400).send(error)
  })
})

//route to delete comments from posts.,
app.delete('/api/comments/:post_id/:comment_id',authenticate,(req,res)=>{
  const post_id = req.params.post_id;
  const comment_id = req.params.comment_id;

  Post.findById(post_id).then((post)=>{
    if(!post){
      res.status(404).send()
    } else{
      post.comments = post.comments.filter(function(a){
        return a._id != comment_id
      })

      post.save().then((results)=>{
        res.send({results})
      })
    }
  }).catch((error)=>{
    res.status(400).send(error)
  })
})

//create new User
app.post('/users', (req, res) => {

	// Create a new user
	let user = new User(req.body)
    user.name = user.name.toLowerCase()
	// save user to database
	user.save().then((result) => {
		res.send(user)
	}, (error) => {
		res.status(400).send(error) // 400 for bad request
	})

})

//update a profile picure
app.post('/update-profile-pic', upload.single('update-profile-pic'), (req, res) => {
    res.send(req.file);
})


app.listen(port, () => {
	log(`Listening on port ${port}...`)
});
