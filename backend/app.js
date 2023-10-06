
const Validator = require("./src/utilities/validator");
const express = require("express");
const githubController = require("./src/githubController");
const cors = require('cors');

const app = express();
const port = 8000;

app.use(cors());

app.get("/", async (req, res) => {
  const partOfDayPercentageOfCommits = await githubController.getPartOfDayPercentageOfCommits();

  res.render("home", {
    pageTitle: "MyRepoStats",
    partOfDayPercentageOfCommits,
  });
});

app.get('/api/stats/username/:username/repo/:reponame', (req, res) => {
  const username = req.params.username;
  const reponame = req.params.reponame;
  const timezone = req.query.timezone;

  try {
    Validator.validateInput(username, reponame, timezone);
  } catch (error) {
    
    return res.status(400).json({error: error.message})
  }

  res.json({
    "stat_content": {"morning": 44, "evening": 32, "night": 33}
  });
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
