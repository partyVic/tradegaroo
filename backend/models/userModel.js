import mongoose from 'mongoose'

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

const User = mongoose.model('User', userSchema)

export default User