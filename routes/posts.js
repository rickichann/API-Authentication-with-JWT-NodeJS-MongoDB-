const router = require('express').Router()
const verify = require('./verifyToken')

router.get('/',verify,(req,res)=> {
    res.json({
        posts: {
            title: 'My firts post',
            description: ' random data you shouldtn acces' 
        }
    }) 
    // res.send(req.user)
    // User.findbyOne({id: req.user})
})
module.exports = router 