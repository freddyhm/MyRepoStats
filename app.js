const express = require('express')
const handlebars = require('express-handlebars')
const axios = require('axios')

const app = express()
const port = 3000

async function fetchGitHubData(){
    try {

      const response = await axios.get(`https://api.github.com/repos/freddyhm/MyRepoStats/commits?per_page=10`)
      
      if (response.status === 200) {
        return response.data
      } else {
        throw new Error(`Request failed with status: ${response.status}`)
      }
    } catch (error) {
      throw error;
    }
}

async function main() {
    try {
        let data = await fetchGitHubData()
    } catch (error) {
        console.error('Error:', error.message)
    }
}

main()

app.engine('handlebars', handlebars.engine())
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