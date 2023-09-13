const express = require('express')
const handlebars = require('express-handlebars');

const path = require('path')
const app = express()
const port = 3000



app.engine('handlebars', handlebars.engine());
app.set("view engine", "handlebars")
app.set('views', './views');

app.get('/', (req, res) => {
    res.render("home", {
        pageTitle: "MyRepoStats"
    })
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})