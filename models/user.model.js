const {Schema, model} = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    firstName: {
        type:String,
        required: true,
        trim:true,
    },
    lastName: {
        type:String,
        required: true,
        trim:true,
    },
    email:{
        type:String,
        unique:true,
        lowercase:true,
        trim:true,
        required:true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'please use a valid email address']
    },
    password:{
        type:String,
        required:true,
        min: 5
    },
    //many to many 
    favourites: [{
        type: Schema.Types.ObjectId,
        ref:'Recipe'
    }],
    roles: [{
        type: Schema.Types.ObjectId,
        ref:'Role',
        required:true
    }],
},{timestamps:true});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password,this.password, function(result){
        return result;
    })
}

module.exports= model('User',userSchema)