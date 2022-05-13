import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// Mongoose schemas have a timestamps option that tells Mongoose to 
// automatically manage createdAt and updatedAt properties on your documents.

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)


// mongoose Schema.prototype.method() Adds an instance method to documents constructed from Models compiled from this schema.

// In general, this is a special variable that points to either the globalObject (e.g window), caller (instance), or Class.
// For an instance's function, this points to the instance. Hence we can do this.password as this points to user instance.
// For a static function (Class's function), this points to the Class. Hence we can do this.find({}) as this points to User model.
// For an arrow function, this does not point to the caller (instance) or its Class, it points to the context where the arrow function is called.
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}



// mongoose middleware:  set certain things to happen on saves/finds and other actions and other methods

// Before we make create/save action, run this middleware to encrypt the password
userSchema.pre('save', async function (next) {

    // !!!only do this if the password field is sent or it's modified !!!
    // if we just update user name profile without changing password, don't run this middleware
    // use mongoose method isModified() to check if password has changed
    if (!this.isModified('password')) {
        return next()   // make sure add return, then the rest of the code will not run
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema)

export default User