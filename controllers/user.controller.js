const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Role = require('../models/role.model');
const Recipe = require('../models/recipe.model');
const roleModel = require('../models/role.model');
require('dotenv').config()
// getting all users
const getAllUsers = (req, res) => {
    const activeUser = req.user._id;
    User.find()
    // selecting to get only this columns
        .select('firstName lastName _id isDeleted') 
        .then(users => {
            // did a standard filter to not show current user
            const filteredUsers = users.filter(user => user._id.toString() !== activeUser.toString());

            if (filteredUsers.length > 0) {
                return res.status(200).json({
                    message: "Users retrieved successfully",
                    users:filteredUsers
                });
            } else {
                return res.status(404).json({
                    message: "No users found"
                });
            }
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({
                message: "Server error, unable to fetch users"
            });
        });
};
// getting another user by id
const getUserById = (req, res) => {
    const userId = req.params.userId;

    User.findById(userId)
        .populate('recipes', 'title cookingTime description')
        .populate('roles', 'name')
        .then(user => {
            console.log(user)
            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            return res.status(200).json({
                message: "User retrieved successfully",
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    recipes: user.recipes,
                    isDeleted: user.isDeleted,
                    roles: user.roles
                }
            });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ message: "Server error" });
        });
};
// Get all recipes of present user
const getUserRecipes = (req, res) => {
    const userId = req.user._id;

    Recipe.find({ user: userId })
    .populate({
        path: 'category',
        model: 'RecipeCategory', 
        select: 'name' 
      })
        .then(recipes => {
            if (recipes.length > 0) {
                return res.status(200).json({
                    message: "Recipes retrieved successfully",
                    recipes
                });
            } else {
                return res.status(404).json({
                    message: "No recipes found for this user." 
                });
            }
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({
                message: "Server error, unable to fetch recipes"
            });
        });
};
// favourites adding, deleting && viewing 
const addFavourite = (req, res) => {
    const userId = req.user._id;
    const recipeId = req.params.recipeId;
    User.findByIdAndUpdate(
        userId,
        // add to set adds the recipe to favourites array if it doesnt already exist
        { $addToSet: { favourites: recipeId } },
        { new: true } 
    )
    .then(user => {
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        return res.status(200).json({
            message: "Recipe added to favourites"
        });
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({
            message:"Server Error"
        });
    });
};
const removeFavourite = (req, res) => {
    const userId = req.user._id;
    const recipeId = req.params.recipeId;

    User.findByIdAndUpdate(
        userId,
        // pull removes the recipe from the favourites if it exists
        // removeFromSet wasn't working for some reason
        { $pull: { favourites: recipeId } },
        { new: true }  
    )
    .then(user => {
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        return res.status(200).json({
            message: "Recipe removed from favourites",
            favourites: user.favourites
        });
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({
            message:"Server Error"
        });
    });
};
// seeing all favourites
const getFavourites = (req, res) => {
    const userId = req.user._id;

    User.findById(userId)
        .populate({
            // path specifies which id we want to populate. which holds recipe ids
            path: 'favourites',
            // acts as a resource, only showing some of the data from the Recipe
            select: 'title description cooking_time image_path , category' 
        })
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }
            return res.status(200).json({
                message: "Favourites retrieved successfully",
                favourites: user.favourites
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                message: "Server Error"
            });
        });
};



module.exports = {
    getAllUsers,
    getUserById,
    getUserRecipes,

    addFavourite,
    removeFavourite,
    getFavourites,
};