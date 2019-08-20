const router = require('express').Router()
const User = require('../model/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { registerValidation,loginValidation} = require('../validation')

//Register
router.post('/register', async (req, res) => {
    //LETS VALIDATE THE DATA BERFORE WE A USER
    const { error } = registerValidation(req.body)

    if (error) return res.status(400).send(error.details[0].message)

    //Checking if the user is already in the database
    const usernameExist = await User.findOne({username:req.body.username})
    if(usernameExist) return res.status(400).send('Username already exists')

    //Hash passwords
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password,salt)


    //Create a new user
    const user = new User({
        username: req.body.username,
        password: hashedPassword,
        name: req.body.name
    })
    try {
        const savedUser = await user.save()
        res.send({user: user._id})
    } catch (err) {
        res.status(400).send(err) 
    }

})

//Login
router.post('/login', async (req,res) => {

    const {error} = loginValidation(req.body) 

    if(error) return res.status(400).send(error.details[0].message)

    const user = await User.findOne({username:req.body.username})
    if(!user) return res.status(400).send('Username is not found')
    //PASSWORD IS CORRECT
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(400).send('Invalid password')
    
    //Create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token',token).send(token)


    
})

module.exports = router