import User from '../models/userModel.js'
import asyncHandler from '../middlewares/asyncHandler.js'
import bcrypt from 'bcryptjs'

const createUser = asyncHandler(async (req, res) => {
    const {username, email, password} = req.body

    if(!username || !email || !password){
        throw new Error("Fill all inputs")
    }

    const userExists = await User.findOne({email})
    if(userExists){
        res.status(400).send("User already exists")
        return
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({username, email, password: hashedPassword})

    try{
        await newUser.save()
        res.status(201).json({_id: newUser._id, username: newUser.username, email: newUser.email, isAdmin: newUser.isAdmin})
    } catch(error){
        res.status(400)
        throw new Error("Invalid user")
    }
})

export {createUser}