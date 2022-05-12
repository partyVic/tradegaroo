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



const User = mongoose.model('User', userSchema)

export default User