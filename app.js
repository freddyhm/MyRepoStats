const express = require('express')
const handlebars = require('express-handlebars')
const axios = require('axios')

const app = express()
const port = 3000

async function fetchGitHubData(){
    try {

      const response = await axios.get(`https://api.github.com/repos/freddyhm/MyRepoStats/commits?per_page=100`)
      
      if (response.status === 200) {
        return response.data
      } else {
        throw new Error(`Request failed with status: ${response.status}`)
      }
    } catch (error) {
      throw error;
    }
}

const PartOfDay = {
    MORNING: 'Morning',
    AFTERNOON: 'Afternoon',
    EVENING: 'Evening',
    NIGHT: 'Night',
    UNKNOWN: 'Unknown'
}


function getPartOfDay(hour){

    const isMorning = hour >= 0 && hour < 12;
    const isAfternoon = hour >= 12 && hour <= 17;
    const isEvening = hour >= 18 && hour <= 20;
    const isNight = hour >= 21 && hour <= 23

    if (isMorning) {
        return PartOfDay.MORNING
    } else if (isAfternoon) {
        return PartOfDay.AFTERNOON
    } else if (isEvening) {
        return PartOfDay.EVENING
    } else if (isNight) {
        return PartOfDay.NIGHT
    } else {
        console.log(`Error: unsupported value ${hour}`)
        return PartOfDay.UNKNOWN
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