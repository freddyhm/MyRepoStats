const express = require("express");
const handlebars = require("express-handlebars");
const githubController = require("./src/githubController");

const app = express();
const port = 3000;

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.get("/", async (req, res) => {
  const partOfDayPercentageOfCommits = await githubController.getPartOfDayPercentageOfCommits();

  res.render("home", {
    pageTitle: "MyRepoStats",
    partOfDayPercentageOfCommits,
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
