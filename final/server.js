/* server.js nov19 - 3pm */
'use strict';
const log = console.log;

const express = require('express')
const port = process.env.PORT || 3000
const bodyParser = require('body-parser') // middleware for parsing HTTP body from client
const session = require('express-session')
const hbs = require('hbs')
//const moment = require('moment')

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
app.get('/post/view/:id', authenticate, (req, res) => {
    const id = req.params.id
    if(!ObjectID.isValid(id)) {
        return res.status(404).send("404 NOT FOUND SORRY")
    }

    
    Post.findById(id).then((post) => {

        if(!post) {
            res.status(404).send("404 NOT FOUND SORRY")
        }
        //fixing line breaks
        post.details = post.details.replace(/(?:\r\n|\r|\n)/g, '<br>');
        console.log(post.details.replace(/(?:\r\n|\r|\n)/g, '<br>'));
        const formattedLocation = encodeURI(post.meetLocation); //for google map search
        let retObj = {
            user: {
                    name: req.session.username, 
                    isAdmin: req.session.isAdmin,
                    profilePicUrl: req.session.profilePicUrl,
                    canEdit: false
            },
            post: post,
            postUrlLocation: formattedLocation
        }
        console.log()
        if(req.session.username == post.creator || req.session.isAdmin) {//these guys can edit parts of the post and add user
            retObj.user.canEdit = true
            res.render("post_view.hbs", retObj)
            
        } else if(post.members.includes(req.session.username)) {//only members of post can view
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
            isEdit: true, //so we can recycle the post-edit page as a make-post page
            post: post
        }
        
        if(req.session.username == post.creator || req.session.isAdmin) {//these guys can edit parts of the post and add user
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
            isEdit: false
        }
        res.render("post_edit.hbs", retObj)  
})   

//creates a new post, assuming a json body 
//that matches the schema , 
//using req.sessionuser for crearor
//This means creator SHOULD NOT be in the request body
app.post('/post/api/create', authenticate, (req, res)=> {
    let templatePost = req.body
    templatePost.creator = req.session.username
    templatePost.profilePicUrl = req.session.profilePicUrl 
    const post = new Post(templatePost)
    post.save().then((result)=> {
        res.redirect('/post/view/' + result.id.toString())
    
    }).catch((error)=>{
        res.status(400).send(error)
    })

    
})

//editing a post, assuming json body has all fields
//EXCEPT CREATOR, AND DATE MADE (you can change these, but why would you)
app.patch('/post/api/edit/:id', authenticate, (req, res) => {
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
        res.status(404).send("404 NOT FOUND SORRY")
    })
    
})  



//creates a report, assuming a json body that matches the schema
//expects only  the perpetrator and content, other fields will be overwritten
//sends a json of the report
//remind me to authenticate
app.post('/reports/api/create', (req, res)=> {
    User.findOne({name: req.body.perpetrator}
    ).then((user)=>{
        let templateReport = req.body
        templateReport.perpetratorPicUrl = user.profilePicUrl
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
//remind me to authenticate
app.post('/reports/api/close/:id', (req, res)=> {
    const id = req.params.id
    Report.findById(id).then((report)=>{
       report.set({isClosed:true})
       return report.save()
    }).then((report)=>{
       res.send(report)
    }).catch((error)=>{
        res.status(400).send(error)
    })
    
})

//need to implement pagination with this
app.get('/reports', authenticate, (req,res)=> {
    if(req.session.isAdmin){
        Report.find({isClosed:false}).sort({date: -1}).then((reports)=>{
            res.render("reports.hbs", {
                user: {
                        name: req.session.username, 
                        profilePicUrl: req.session.profilePicUrl
                },
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

app.listen(port, () => {
	log(`Listening on port ${port}...`)
});


