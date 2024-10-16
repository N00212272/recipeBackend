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
const deleteData = (req,res) => {
    let id = req.params.id;

    Recipe.findByIdAndDelete(id)
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