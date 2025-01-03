const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Role = require('../models/role.model');
require('dotenv').config();

const register = (req,res) => {
    console.log(req.body);
    Role.findOne({ name: 'customer' })
    .then(customerRole => {
        if (!customerRole) {
            return res.status(500).json({
                message: "Customer role not found, please seed the database."
            });
        }
    let newUser = new User(req.body);
    newUser.password = bcrypt.hashSync(req.body.password, 10)
    newUser.roles = [customerRole._id];
    return newUser.save()
    })
    .then(data => {
        data.password = undefined;
        return res.status(201).json(data)
    })
    .catch(err => {
        if (err.code === 11000) {
            return res.status(400).json({
                message: "Email already exists. Please use a different email."
            });
        }
        return res.status(500).json({
            message:err.message
        })
    });
}
const login = (req,res) => {
    User.findOne({email: req.body.email})
    // populate function returns roles with actual role docs
    .populate('roles') 
    .then(user => {
        if(!user || !user.comparePassword(req.body.password)){
            return res.status(401).json({
                message:"authentication failed. Invalid User"
            })
        }
        // const roleNames = user.roles.map(role => role.name);
        return res.status(200).json({
            message:"Logged in succesfully",
            token: jwt.sign({
                email: user.email,
                first_name: user.firstName,
                last_name: user.lastName,
                _id: user._id,
                roles: user.roles
            },process.env.JWT_SECRET),
           
        })

    })
    .catch(err => {
        return res.status(500).json(err)
    });

}
// other advanced functions for development
const registerAdmin = (req,res) => {
    console.log(req.body);
    Role.findOne({ name: 'admin' })
    .then(adminRole => {
        if (!adminRole) {
            return res.status(500).json({
                message: "Role not found"
            });
        }
    let newUser = new User(req.body);
    newUser.password = bcrypt.hashSync(req.body.password, 10)
    newUser.roles = [adminRole._id];
    return newUser.save()
    })
    .then(data => {
        data.password = undefined;
        return res.status(201).json(data)
    })
    .catch(err => {
        if (err.code === 11000) {
            return res.status(400).json({
                message: "Email already exists. Please use a different email."
            });
        }
        return res.status(500).json({
            message:err.message
        })
    });
}

// had to do an async function as it needs to check if the old password was correct before proceeding

// needs to be fixed 

const updatePassword = async (req,res) => {
    try{
        const userId = req.user._id;
        // console.log(userId)
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(userId);
            if(!user || user.comparePassword(oldPassword)){
                return res.status(401).json({
                    message:"authentication failed. Invalid User"
                })
            }
        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        user.password = encryptedPassword;
        await user.save();
        return res.status(201).json({
            message:"password changed succesfully"
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"server error"
        })
    }
}
module.exports = {
    register,
    login,

    registerAdmin,
    updatePassword,
};