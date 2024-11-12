const Recipe = require('../models/recipe.model')

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

    // Manually adding validation since it's required but wasn't working in schema
    if (!body.ingredients || body.ingredients.length === 0) {
        return res.status(400).json({ message: "Ingredients are required" });
    }

    
    Recipe.create(body)
        .then(data => {
            console.log(`Recipe created`, data);
            // storing the data to use in the next middleware
            req.recipe = data; 
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
// once the recipe is added to users
const submitCreate = (req, res) => {
    return res.status(201).json({
        message: "Recipe created and added to user successfully",
        recipe: req.recipe  
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
    await Recipe.findByIdAndDelete(id)
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