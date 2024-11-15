const Recipe = require('../models/recipe.model')
const Ingredient = require('../models/ingredient.model')
const fs = require('fs')
const readAll = (req,res) => {
    Recipe.find()
    .then(data => {
        console.log(data);
        if(data.length > 0){
            return res.status(200).json(data)
        }
        else{
            return res.status(404).json("None found")
        }
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json(err)
    })

}
// had to modify read one to populate within a populate
const readOne = (req,res) => {
    let id = req.params.id;
    Recipe.findById(id)
    .populate({
        // had to reference the path of populated field
        path: 'ingredients.ingredient',  
        // also had to reference each model as it didn't know where to find it 
        model: 'Ingredient',
        // created another populate function within the populate to reference to the fks in the ingredient model
        populate: [
            // using the select to specifify what to show
            { path: 'category_id', model: 'IngredientCategory', select: 'name' }, 
            { path: 'unit_id', model: 'Unit', select: 'name abbreviation' }
        ],
        select: 'name calories'
    })
    .then(data => {
        if(!data){
            return res.status(404).json({
                message: `Recipe with id: ${id} not found`
            })
        }
        return res.status(200).json({
            message: `Recipe with id: ${id} retrieved`,
            data
        })
    })
    .catch(err => {
        if(err.name === "CastError"){
            return res.status(404).json(`Recipe with id: ${id} not found`);
        }
        console.log(err);
        return res.status(500).json(err)
    })
}

const createData = (req, res, next) => {
    console.log(req.body);
    let body = req.body;
    body.user = req.user._id;
    
    // IMAGE UPLOAD TO S3
    if(req.file){
        body.image_path = process.env.STORAGE_ENGINE === 'S3' ? req.file.key : req.file.filename
    }


    
    // created an empty array to hold do a loop through any ingrediens within the body and store it
    const ingredients = [];
    let i = 0;
    while (req.body[`ingredients[${i}].ingredient`] && req.body[`ingredients[${i}].quantity`]) {
        ingredients.push({
            ingredient: req.body[`ingredients[${i}].ingredient`],
            quantity: parseInt(req.body[`ingredients[${i}].quantity`], 10)
        });
        i++;
    }

    // Add the ingredients array to the body before validation
    body.ingredients = ingredients;

    
    Recipe.create(body)
        .then(data => {
            // console.log(`Recipe created`, data);
            // storing the data to use in the next middleware
            req.recipe = data; 
            // console.log(req.recipe.ingredients)
            next();
            
        })
        .catch(err => {
            console.log(err);
            if (err.name === 'ValidationError') {
                return res.status(422).json({ error: err });
            }
            return res.status(500).json(err);
        });
};
// once the recipe is added to users then added to ingredients
const submitCreate = (req, res) => {
    const recipeId = req.recipe._id;
    
    // got the igredients from the req.body
    const ingredients = req.body.ingredients; 

    // used map to go through each ingredient and add the id within the recipes table
    const ingredientUpdates = ingredients.map(ingredientObj => 
        Ingredient.findByIdAndUpdate(
            ingredientObj.ingredient, 
            { $addToSet: { recipes: recipeId } },  
            { new: true, useFindAndModify: false }
        )
    );

    // promise all waits for all ingredients to finish
    Promise.all(ingredientUpdates)
        .then(() => {
            res.status(201).json({
                message: "Recipe created and added to ingredients successfully",
                recipe: req.recipe  
            });
        })
        .catch(err => {
            res.status(500).json({ message: "Failed to update ingredients", error: err });
        });
};




const updateData = (req,res) => {
    let id = req.params.id;
    let body = req.body;
    console.log(id)
    Recipe.findByIdAndUpdate(id,body, {
        new:true,
        runValidators:true,
    })
        .then(data => {
            console.log(`Recipe updated`, data);
            return res.status(201).json({
                message: "Recipe updated",
                data
            })
        })
        .catch(err => {
            console.log(err)
            if(err.name === "CastError"){
                if(err.kind === 'ObjectId'){
                    return res.status(404).json({
                        message: `Recipe with id:${id} not found`
                    });
            }
            else{
                return res.status(422).json({
                    message: err.message
                })
            }
        }
            return res.status(500).json(err)
        });
}
const deleteData = async (req,res) => {
    let id = req.params.id;
    const userId = req.user._id;
    const foundRecipe = await Recipe.findById(id);

    if (!foundRecipe) {
        return res.status(404).json({ message: `Recipe with id ${id} not found` });
    }
    // had to make it to string as it wasn't working when the id wasnt transformed to string
    if (foundRecipe.user.toString() !== userId.toString()) {
        return res.status(403).json({ message: "You are not authorized to delete this recipe" });
    }
    await Recipe.findByIdAndUpdate(id)
    .then(data => {
        if(!data){
            return res.status(404).json({ message: `Recipe with id ${id} not found` });
        }
        
         return res.status(200).json({
        "message":`Recipe Deleted with id: ${id} `});
    })
    .catch(err => {
        console.log(err)
        if(err.name === "CastError"){
            return res.status(404).json(`Recipe with id: ${id} not found`);
        }
        return res.status(500).json(err)
    })
}



module.exports = {
    readAll,
    readOne,
    createData,
    submitCreate,
    updateData,
    deleteData
}