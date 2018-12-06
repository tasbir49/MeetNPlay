/* Users model */
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

//reference: https://stackoverflow.com/questions/563406/add-days-to-javascript-date
//for adding days to date
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}



// We'll make this model in a different way
const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 1,
		trim: true, // trim whitespace
		unique: true
	},
    city: {
		type: String,
		required: true,
		minlength: 1
	},
    about: {
		type: String,
        default: "No info",
		required: true,
		minlength: 1,
		trim: true // trim whitespace
	},
    memberSince: {
        type: Date,
        default: Date.now(),
		required: true 
    },
    profilePicUrl: {
        type: String,
        default: "/resources/images/user_avatar.png",
        required: true
        
    },
    isAdmin : {
        type: Boolean,
        default: false,
        required: true
        
    },
    isBanned : {
        type: Boolean,
        default: false,
        required: true
    },
	password: {
		type: String,
		required: true,
		minlength: 6
	}
})

//user finding function taken from lecture
UserSchema.statics.findByNamePassword = function(name, password) {
	const User = this

	return User.findOne({name: name.toLowerCase()}).then((user) => {
		if (!user) {
			return Promise.reject()
		}

		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (error, result) => {
				if (result) {
					resolve(user);
				} else {
					reject();
				}
			})
		})
	})
}

// This function runs before saving user to database
UserSchema.pre('save', function(next) {
	const user = this

	if (user.isModified('password')) {
		bcrypt.genSalt(10, (error, salt) => {
			bcrypt.hash(user.password, salt, (error, hash) => {
				user.password = hash
				next()
			})
		})
	} else {
		next();
	}

})

const CommentSchema = new mongoose.Schema({
    content: String,
    date: Date,
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    }
})

const PostSchema = new mongoose.Schema({//most of these defaults are for testing purposes
	creator : {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    keywords : {
        type: [String],
        default: [],
        required: true
    },
    gameGenres : {
        type: [String],
        default: ["Not in IGDB Database"],
        required: true
    },
    members: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
        default: [],
        required: true
    },
    gameTitle: {
        type: String,
        default: "MeetNPlay Meet",
        required: true
    },
    gamePicUrl: {
        type: String,
        default: "/resources/images/logo.png" ,
        required: true
    },
    date: {
        type: Date,
        default: Date.now(), //default is a week from now
        required: true
    },
    dateMade: {
        type: Date,
        default: Date.now(), //default is a week from now
        required: true
    }, 
    meetLocation: {
        type: String,
        default: "27 King's College Cir, Toronto, ON M5S", //uoft
        required: true
    },
    playersNeeded: {
        type: Number,
        default: 2,
        required: true
    },
    details: {
        type: String,
        default: "Let's have a lot of fun!\nThere will be great food, a friendly atmosphere, and some hardcore gaming.\nThe only rule is to bring your own alcohol :D.",
        required: true 
    },
    inviteReqs: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
        default: [],
        required: true
    },
    comments: {
        type: [CommentSchema],
        default: [],
        required: true
    },
    
    isDeleted: {
        type: Boolean,
        default: false,
        required: true
    }
    
})

const ReportSchema= new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now()
    },
    isClosed: {
        type: Boolean,
        default: false
    },
    perpetrator: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
        required: true
    },
    content: String
    
})

const Report = mongoose.model('Report', ReportSchema)
const User = mongoose.model('User', UserSchema)
const Post = mongoose.model('Post', PostSchema)

module.exports = { User:User, Post:Post, Report:Report}