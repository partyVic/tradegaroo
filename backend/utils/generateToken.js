import jwt from 'jsonwebtoken'

const generateToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: '30d' // will expires in 30 days
    })
}

export default generateToken

