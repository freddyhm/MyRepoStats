
const Validator = require("./src/utilities/validator");
const express = require("express");
const CommitFetcherService = require("./src/services/CommitFetcherService");
const cors = require('cors');

const app = express();
const port = 8000;

app.use(cors());

app.get("/", async (req, res) => {
  

  
});

app.get('/api/stats/username/:username/repo/:reponame', async (req, res) => {
  const username = req.params.username;
  const reponame = req.params.reponame;
  const timezone = req.query.timezone;

  try {
    Validator.validateInput(username, reponame, timezone);
  } catch (error) {
    return res.status(400).json({error: error.message})
  }

  const commitFetcherService = new CommitFetcherService(username, reponame, timezone);
  const partOfDayPercentageOfCommits = await commitFetcherService.createStatReport();

  res.json({
    "stat_content": partOfDayPercentageOfCommits,
  });
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
