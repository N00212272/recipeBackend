require('dotenv').config()
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Role = require('../models/role.model');
const Recipe = require('../models/recipe.model')

const loginRequired = (req,res,next) => {
    if(req.user){
        next();
    }
    else{
        return res.status(401).json({
            message:"Unauthorised User!"
        })
    }
}


// checks if the role is equal to admin etc
const hasRole = (role) => {

    return (req,res,next) => {
        // needed to add some function as to check the array of roles. To see if at least one is true
        if (req.user.roles.some(userRole => userRole.name === role)) {
            return next();
        }
            else{
                return res.status(401).json({
                    message:"Unauthorised User!"
                })
            }
        }

}
// Users who own the recipe can update or delete them
function ownsRecipe(req, res, next) {
    const userId = req.user._id;
    const recipeId = req.params.id;

    Recipe.findById(recipeId)
        .then(recipe => {
            if (!recipe) {
                return res.status(404).json({
                    message: "Recipe not found"
                });
            }
            // place both into a string as i was having issues when they weren't in a string
            if (recipe.user.toString() !== userId.toString()) {
                return res.status(403).json({
                    message: "Unauthorized action"
                });
            }
            next();
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ message: "Server error" });
        });
}
const addRecipeToUser = (req, res, next) => {
    console.log(req);

    const userId = req.user._id;
    const recipeId = req.recipe._id;  

    User.findByIdAndUpdate(
        userId,
        { $addToSet: { recipes: recipeId } },  
        { new: true } 
    )
    .then(user => {
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        next();  
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({
            message: "Server error while updating user recipes"
        });
    });
}

module.exports = {
    loginRequired,
    hasRole,
    ownsRecipe,
    addRecipeToUser
};