const Recipe = require('../models/recipe.model')
const Ingredient = require('../models/ingredient.model')
const User = require('../models/user.model')
const fs = require('fs')
const readAll = (req,res) => {
    Recipe.find()
    .populate({
        path: 'category',
        model: 'RecipeCategory', 
        select: 'name' 
      })
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
        path: 'category',
        model: 'RecipeCategory', 
        select: 'name' 
      })
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

const createData = async (req, res) => {
    try {
        // Extract body and user
        console.log(req.body);
        let body = req.body;
        body.user = req.user._id;

        // Handle image upload to S3
        if (req.file) {
            body.image_path = process.env.STORAGE_ENGINE === 'S3' ? req.file.key : req.file.filename;
        }

        //created an empty array to hold do a loop through any ingrediens within the body and store it
        const ingredients = [];
        let i = 0;
        while (req.body[`ingredients[${i}].ingredient`] && req.body[`ingredients[${i}].quantity`]) {
            ingredients.push({
                ingredient: req.body[`ingredients[${i}].ingredient`],
                quantity: parseInt(req.body[`ingredients[${i}].quantity`], 10),
            });
            i++;
        }

        // Attach ingredients to the recipe body
        body.ingredients = ingredients;

        // Creating the recipe first
        const recipe = await Recipe.create(body);

        // adding the recipe to the users array
        const userUpdate = User.findByIdAndUpdate(
            req.user._id,
            { $addToSet: { recipes: recipe._id } },
            { new: true }
        );

        // Update ingredients with the created recipe's ID
        const ingredientUpdates = ingredients.map((ingredientObj) =>
            Ingredient.findByIdAndUpdate(
                ingredientObj.ingredient,
                { $addToSet: { recipes: recipe._id } },
                { new: true, useFindAndModify: false }
            )
        );
        
        // Wait for recipe to add to user array and using rest operator for all ingredient updates to complete 
        await Promise.all([userUpdate, ...ingredientUpdates]);


        return res.status(201).json({
                message: "Recipe created",
                recipe
        })
    } catch (err) {
        console.error(err);

        if (err.name === 'ValidationError') {
            return res.status(422).json({ error: err });
        }

        res.status(500).json({ message: "Failed to create recipe", error: err });
    }
};



const updateData = async (req,res) => {
    let id = req.params.id;
    let body = req.body;
    console.log(id)
    // .then didnt work needed to use a try as i was getting a timeout
    try {
        // Find the recipe by ID first to compare old ingredients
        const foundRecipe = await Recipe.findById(id);
        if (!foundRecipe) {
            return res.status(404).json({
                message: `Recipe with id: ${id} not found`
            });
        }
        const ingredients = [];
        let i = 0;
        while (req.body[`ingredients[${i}].ingredient`] && req.body[`ingredients[${i}].quantity`]) {
            ingredients.push({
                ingredient: req.body[`ingredients[${i}].ingredient`],
                quantity: parseInt(req.body[`ingredients[${i}].quantity`], 10),
            });
            i++;
        }
        body.ingredients = ingredients;
        // checking if there are ingredients first
        if (ingredients && ingredients.length > 0){
            // finding all old ingredients first
            const oldIngredients = foundRecipe.ingredients.map(ingredientObj => ingredientObj.ingredient.toString());
            // getting all the new ingredients
            const newIngredients = ingredients.map(ingredientObj => ingredientObj.ingredient.toString());
            // checking if the old ingredient id matches any of the new
            const ingredientsToRemove = oldIngredients.filter(id => !newIngredients.includes(id));
            // now comparing the new with the old
            const ingredientsToAdd = newIngredients.filter(id => !oldIngredients.includes(id));
            // did both to have two variables where i can remove from set and add to set depending on the the variable
            // empty array to prepare remove and add of ingredients
            const updatePromises = [];
            // removing any ingredients that arent there any more
            if (ingredientsToRemove.length > 0) {
                updatePromises.push(
                    await Ingredient.updateMany(
                        { _id: { $in: ingredientsToRemove } },
                        // pull to remove from the set
                        { $pull: { recipes: id } }
                    )
                );
            }
            // adding any new ingredients
            if (ingredientsToAdd.length > 0) {
                updatePromises.push(
                    await Ingredient.updateMany(
                        { _id: { $in: ingredientsToAdd } },
                        { $addToSet: { recipes: id } }
                    )
                );    
            }    
            await Promise.all(updatePromises);
        }
           
            // updating the recipe
            const updatedRecipe = await Recipe.findByIdAndUpdate(id, body, {
                new: true,
                runValidators: true,
            });

            return res.status(201).json({
                message: "Recipe updated successfully",
                data: updatedRecipe,
            });
        }
    catch(err) {
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
        };
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
    await Recipe.findByIdAndUpdate(
        id,
        {$set: {isDeleted:true}},
        {new:true}
    )
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
    updateData,
    deleteData
}