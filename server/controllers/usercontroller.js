const router = require('express').Router();
const User = require('../db').import('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//signup
router.post('/signup', (req, res) =>{
    User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    })
        .then(
            createSuccess = (user) => {
                let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {
                    expiresIn: 60*60*24}) //seconds*hours*days
                res.json({
                    user: user,
                    message: 'user created',
                    sessionToken: token
                })    
            },
            createError = err => res.send(500, err)
        )
        // .catch(err=> res.status(500).json({
        //     error: err
        // }))
})

//signin

router.post('/login', (req, res) =>{
    User.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(user => {
            if(user) {
                bcrypt.compare(req.body.password, user.password, (err, matches) => {
                    if(matches) {
                        let token = jwt.sign ({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24})
                        res.json ({
                            user: user,
                            message: 'user succesfully logged in',
                            sessionToken: token
                        })
                    } else {
                        res.status(502).send ({error: 'bad gateway'}) // password dont match
                    }
                })
            }else {
                res.status(500).send ({error: 'failed to authenticate'}) // email didn't match an existing user in the database
            }
        }, err => res.status(501).send({error: 'failed to process'})) // for anything else that fails ... a catch all 
})


module.exports = router;