const express = require('express')
const path = require('path')
const app = express()
const port = 3000

app.get('/', (req, res) => {

const filePath = path.join(__dirname, 'index.html')

  res.sendFile(filePath)
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})