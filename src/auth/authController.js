const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { json } = require('express')

const register = async (req , res) => {
    console.log(req.body);
    const {username , email , password} = req.body;

    try{
        
        let user = await User.findOne({email});

        if(user){
            return res.status(400).json({
                message:'User already exists'
            });

        }

        user = new User({
            username,
            email,
            password: await bcrypt.hash(password , 10),
            connected:false
        });

        await user.save()
        res.status(201).json({
            message:'Registration Successfull'
        });

    }
    catch (err){
        console.error(err)
        res.status(500).send("Server Error!")

    }
}

const login = async (req,res) => {

    const {email , password} = req.body;

    try{
         const user = await User.findOne({email});
         if(!user){
            res.status(400).json({message: 'Invalid credentials 1'});

         }

         const isMatch = await bcrypt.compare(password , user.password);
         if(isMatch ){
            return res.status(400).json({
                message:'Invalid Credentials 2'
            });

         }

         const payload = {
            user : {
                id:user.id,
                username : user.username,
                email : user.email
            }
         };

         jwt.sign(payload , process.env.JWT_SECRET , {expiresIn: '1h'} ,
             (err,token) => {
                if(err) throw err ;
                res.json({token});
             });   
    }

    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');

    }

};

module.exports = {register , login};
