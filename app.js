const express = require('express')
jwt = require('jsonwebtoken')
const cors = require('cors');
const app = express()
require('dotenv').config();
if(process.env.ENVIROMENT !== 'testing'){
    require('./config/db').connect();
}
app.use(cors());
app.use(express.json());
//Authorization
app.use((req,res,next) => {
    let authHeader = req.headers?.authorization?.split(' ')
    if(req.headers?.authorization && authHeader[0] === 'Bearer'){
      jwt.verify(authHeader[1], process.env.JWT_SECRET, (err,decoded) => {
            if(err) req.user = undefined;
            req.user = decoded;
            next()
      })
    }
    else {
        req.user = undefined
        next()
    }
    console.log(authHeader);
    return res.status(200)
});


app.set('view engine','html');
app.use(express.static(__dirname + '/views/'));

app.use('/api/ingredients', require('./routes/ingredients'))
app.use('/api/recipes', require('./routes/recipes'))
app.use('/api/users', require('./routes/users'))
app.use('/api/units', require('./routes/units'))
app.use('/api/recipes-categories', require('./routes/recipeCategory'))
app.use('/api/ingredients-categories', require('./routes/ingredientCategory'))

module.exports = app;