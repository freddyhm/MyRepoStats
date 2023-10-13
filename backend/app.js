
const Validator = require("./src/utilities/validator");
const express = require("express");
const CommitFetcherService = require("./src/services/commitFetcherService");
const cors = require('cors');
const BaseApiError = require("./src/errors/api/baseApiError");

const app = express();
const port = 8000;

app.use(cors());

app.get('/api/stats/username/:username/repo/:reponame', async (req, res) => {

  const username = req.params.username;
  const reponame = req.params.reponame;
  const timezone = req.query.timezone;

  try {
    Validator.validateInput(username, reponame, timezone);
  } catch (error) {
    res.status(400).json({error: error.message}).end()
  }

  const commitFetcherService = new CommitFetcherService(username, reponame, timezone);
  let partOfDayPercentageOfCommits = {}
  try {
    partOfDayPercentageOfCommits = await commitFetcherService.createStatReport();
  } catch (error) {
    if (error instanceof BaseApiError) {
      res.status(error.status_code).json({error: error.message}).end()
    }
  }

  res.json({
    "stat_content": partOfDayPercentageOfCommits,
  });
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
