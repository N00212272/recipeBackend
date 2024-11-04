const Unit = require('../models/unit.model')

const readAll = (req,res) => {
    Unit.find()
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
    Unit.findById(id)
    .then(data => {
        if(!data){
            return res.status(404).json({
                message: `Unit with id: ${id} not found`
            })
        }
        return res.status(200).json({
            message: `Unit with id: ${id} retrieved`,
            data
        })
    })
    .catch(err => {
        if(err.name === "CastError"){
            return res.status(404).json(`Unit with id: ${id} not found`);
        }
        console.log(err);
        return res.status(500).json(err)
    })
}

const createData = (req,res) => {
    console.log(req.body)
    let body = req.body;

    Unit.create(body)
        .then(data => {
            console.log(`Unit created`, data);
            return res.status(201).json({
                message: "Unit created",
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

    Unit.findByIdAndUpdate(id,body, {
        new:true,
        runValidators:true,
    })
        .then(data => {
            console.log(`Unit updated`, data);
            if(!data){
                return res.status(404).json({ message: `Unit with id ${id} not found` });
            }
            return res.status(201).json({
                message: "Unit updated",
                data
            })
        })
        .catch(err => {
            console.log(err)
            if(err.name === "CastError"){
                if(err.kind === 'ObjectId'){
                    return res.status(404).json({
                        message: `Unit with id:${id} not found`
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

    Unit.findByIdAndDelete(id)
    .then(data => {
        if(!data){
            return res.status(404).json({ message: `Unit with id ${id} not found` });
        }
         return res.status(200).json({
        "message":`Unit Deleted with id: ${id} `});
    })
    .catch(err => {
        console.log(err)
        if(err.name === "CastError"){
            return res.status(404).json(`Unit with id: ${id} not found`);
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