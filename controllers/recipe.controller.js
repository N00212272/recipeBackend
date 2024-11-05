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
const readOne = (req,res) => {
    let id = req.params.id;
    Recipe.findById(id)
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

const createData = (req,res) => {
    console.log(req.body)
    let body = req.body;

    Recipe.create(body)
        .then(data => {
            console.log(`Recipe created`, data);
            return res.status(201).json({
                message: "Recipe created",
                data
            })
        })
        .catch(err => {
            
            console.log(err);
            if(err.name === 'ValidationError'){
                return res.status(422).json({
                    error:err
                })
            }
            return res.status(500).json(err)
        })
}

const updateData = (req,res) => {
    let id = req.params.id;
    let body = req.body;

    Recipe.findByIdAndUpdate(id,body, {
        new:true,
        runValidators:true,
    })
        .then(data => {
            console.log(`Recipe updated`, data);
            if(!data){
                return res.status(404).json({ message: `Recipe with id ${id} not found` });
            }
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
const recipesByUser = (req, res) => {
    const userId = req.user._id;

    Recipe.find({ user: userId })
        .then(recipes => {
            if (recipes.length > 0) {
                return res.status(200).json(recipes);
            } else {
                return res.status(404).json({ message: "No recipes found for this user." });
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json(err);
        });
}
module.exports = {
    readAll,
    readOne,
    createData,
    updateData,
    deleteData,
    recipesByUser
}