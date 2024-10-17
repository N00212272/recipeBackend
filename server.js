const express = require('express')
const app = express()
const port = 5000;
require('dotenv').config();
require('./config/db.js')();



app.use(express.json())

app.set('view engine','html');
app.use(express.static(__dirname + '/views/'));

app.use('/api/ingredients', require('./routes/ingredients'))
app.use('/api/recipes', require('./routes/recipes'))
app.use('/api/users', require('./routes/users'))
app.use('/api/favourites', require('./routes/favourites'))
app.use('/api/recipes/categories', require('./routes/recipeCategory'))
app.use('/api/ingredients/categories', require('./routes/ingredientCategory'))

app.listen(port, () => {
    console.log(`Example app listening on port ${5000}`)
})