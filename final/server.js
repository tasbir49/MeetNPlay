/* server.js nov19 - 3pm */
'use strict';
const log = console.log;

const express = require('express')
const port = process.env.PORT || 3000
const bodyParser = require('body-parser') // middleware for parsing HTTP body from client
const session = require('express-session')
const hbs = require('hbs')
const igdb = require('igdb-api-node').default;


const { ObjectID } = require('mongodb')

// Import our mongoose connection
const { mongoose } = require('./db/mongoose');

// Import the models
/* const { Student } = require('./models/student')
const { User } = require('./models/user') */
const Models  = require('./models/model')
const User = Models.User
const Post = Models.Post
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
	if (req.session.username) {
		res.redirect('home')
	} else {
		next();
	}
}

// Middleware for authentication for resources
const authenticate = (req, res, next) => {
	if (req.session.username) {
		User.find({name: req.session.user}).then((user) => {
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

// route for root; redirect to login
app.get('/', sessionChecker, (req, res) => {
	res.redirect('/home')
})

// route for login
app.route('/login')
	.get(sessionChecker, (req, res) => {
		res.sendFile(__dirname + '/public/login.html')
	})

//getting a post page (NOT THE JSON, THE ACTUAL WEB PAGE)
app.get('/post/:id', authenticate, (req, res) => {
    const id = req.params.id
    if(!ObjectID.isValid(id)) {
        return res.status(404).send("404 NOT FOUND SORRY")
    }


    Post.findById(id).then((post) => {

        if(!post) {
            res.status(404).send("404 NOT FOUND SORRY")
        }

        let retObj = {
            user: {
                    name: req.session.username,
                    isAdmin: req.session.isAdmin,
                    profilePicUrl: req.session.profilePicUrl,
                    canEdit: false
            },
            post: post
        }

        if(req.session.username == post.creator.name || req.session.isAdmin) {//these guys can edit parts of the post and add user
            retObj.user.canEdit = true
            res.render("post_view.hbs", retObj)

        } else if(post.members.map((member)=> {//only members of post can view
            return member.name
        }).includes(req.session.username)) {
            res.render("post_view.hbs", retObj)

        } else {
            return res.status(403).send("YOU DONT HAVE PERMISSION TO ACCESS THIS RESOURCE")
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


    Post.findById(id).then((post) => {

        if(!post) {
            res.status(404).send("404 NOT FOUND SORRY")
        }

        let retObj = {
            user: {
                    name: req.session.username,
                    isAdmin: req.session.isAdmin,
                    profilePicUrl: req.session.profilePicUrl,
            },
            isNew: false //so we can recycle the post-edit page as a make-post page
        }

        if(req.session.username == post.creator.name || req.session.isAdmin) {//these guys can edit parts of the post and add user
            res.render("post_edit.hbs", retObj)

        } else {
            return res.status(403).send("YOU DONT HAVE PERMISSION TO ACCESS THIS RESOURCE")
        }
    }).catch((error)=> {
        res.status(400).send(error)
    })

})


//getting a page to make post
app.get('/post/make', authenticate, (req, res) => {
        let retObj = {
            user: {
                    name: req.session.username,
                    isAdmin: req.session.isAdmin,
                    profilePicUrl: req.session.profilePicUrl,
            },
            isNew: false
        }
        res.render("post_edit.hbs", retObj)
})

//creates a new post, assuming a json body that matches the schema
app.post('/post', authenticate, (req, res)=> {
    const post = new Post(req.body)
    post.save().then((result)=> {
        res.redirect('/post/' + result.id.toString())
    }).catch((error)=> {
        res.status(404).send(error)
    })
})

//editing a post, assuming json body has all field
app.patch('/post/:id', authenticate, (req, res) => {
    const id = req.params.id
    if(!ObjectID.isValid(id)) {
        return res.status(404).send("404 NOT FOUND SORRY")
    }


    Post.findById(id).then((post) => {

        if(!post) {
            res.status(404).send("404 NOT FOUND SORRY")
        }

        let retObj = {
            user: {
                    name: req.session.username,
                    isAdmin: req.session.isAdmin,
                    profilePicUrl: req.session.profilePicUrl,
            },
        }

        if(req.session.username == post.creator.name || req.session.isAdmin) {//these guys can edit parts of the post and add user
            post.set(req.body)
            post.save().then( (post) => {res.redirect("/post/" + post.id.toString())}
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

    User.findOne({name: username}).then((user) => {
        let retObj = {
                user: {
                        name: req.session.username,
                        isAdmin: req.session.isAdmin,
                        profilePicUrl: req.session.profilePicUrl,
                        canEdit: false,
                        isJustOwner: false
                    },
                userDetails : user, //header uses the "user" field to display profile pic and link to own profile page, so the details for this page are put in this field instead
                formattedMemberSince: user.memberSince.toISOString().substring(0, 10)
            }

        if(!user) {
            res.status(404).send("404 NOT FOUND SORRY")
        }
        if(req.session.isAdmin) {
            retObj.user.canEdit = true
            retObj.user.isJustOwner = false //means this guy doesnt ONLY own the username, this is for differences in view for these two(admins dont need to confirm password changes)
        }
        else if(req.session.username == username) {//these guys can edit parts of the post and add user
            retObj.user.canEdit = true
            retObj.user.isJustOwner = true
        }
        res.render("user_profile.hbs", retObj)

    }).catch((error)=> {
        res.status(400).send(error)
    })

})

//homepage
app.get('/home', (req, res) => {
	// check if we have active session cookie
	if (req.session.username) {
		//res.sendFile(__dirname + '/public/dashboard.html')
		res.render('homepage.hbs', {
			user:{
                name: req.session.username,
                isAdmin: req.session.isAdmin,
                profilePicUrl: req.session.profilePicUrl},
            headerTitle: "HOME"
		})
	} else {
		res.sendFile(__dirname + '/public/login.html')
	}
})

// User login and logout routes

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
                req.session.username = user.name;
                req.session.profilePicUrl = user.profilePicUrl
                req.session.isAdmin = user.isAdmin;
                res.redirect('/home')
            }
		}
	}).catch((error) => {
		res.status(400).redirect('/login')
	})
})

app.get('/logout', (req, res) => {

	req.session.destroy((error) => {
		if (error) {
            res.status(500).send(error)
		} else {
			res.redirect('/')
		}
	})
})




/// Student routes go below

// Set up a POST route to create a student
app.post('/students', authenticate, (req, res) => {
	log(req.body)

	// Create a new student
	const student = new Student({
		name: req.body.name,
		year: req.body.year,
		creator: req.user._id // from the authenticate middleware
	})

	// save student to database
	student.save().then((result) => {
		// Save and send object that was saved
		res.send(result)
	}, (error) => {
		res.status(400).send(error) // 400 for bad request
	})

})


/** User routes **/
app.post('/users', (req, res) => {

	// Create a new user
	const user = new User(req.body)

	// save user to database
	user.save().then((result) => {
		res.send(user)
	}, (error) => {
		res.status(400).send(error) // 400 for bad request
	})

})

/** Get all Database and id
	array of JSON
[{id:<id>,
 name: <name>
}]
**/
app.get('/igdb/',(req,res)=> {
 igdb_client.games({
	 fields: "name,id",
	 limit:10
  }).then(response=>{
	 console.log(response.body.length);
	 res.send(response.body.sort((a,b)=>{
		 let x = a.name.toLowerCase()
		 let y = b.name.toLowerCase()
		 if(x<y) {return -1}
		 if(x>y) {return 1}
	 }));
 }).catch(error=>{
	 res.status(400).send(error)
 })
})

app.get('/igdb/:name',(req,res)=>{

	igdb_client.games({
		fields:"name",
		limit:10,
		filters: {"name-prefix": req.params.name,
							"version_parent-not_exists":1}
	}).then(response=>{
		console.log(req.params.name);
		res.send(response.body)
	}).catch(error=>{
		res.status(400).send(error)
	})
})


app.listen(port, () => {
	log(`Listening on port ${port}...`)
});