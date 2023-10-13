const axios = require("axios");
const NotFoundError = require("../errors/api/notFoundError");
const TooManyRequestError = require("../errors/api/tooManyRequestError");
const InternalServerError = require("../errors/api/internalServerError");

class CommitFetcherService {
  
  #PartOfDay = {
    MORNING: "morning",
    AFTERNOON: "afternoon",
    EVENING: "evening",
    NIGHT: "night",
    UNKNOWN: "unknown",
  };

  #username;
  #reponame;
  #timezone;
  
  constructor(username, reponame, timezone) {
    this.#username = username;
    this.#reponame = reponame;
    this.#timezone = timezone;
  }

  async createStatReport() {
    try {
      let rawData = await this.#fetchGitHubData();
      return this.#formatRawData(rawData); // rename
    } catch (error) {
      throw error;
    }
  }

  async #fetchGitHubData() {
    try {
      const response = await axios.get(
        `https://api.github.com/repos/${this.#username}/${this.#reponame}/commits?per_page=100`,
      );

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) { 
      if (error.response.status == 404) {  
        throw new NotFoundError("Username and/or repo name do not exist in Github", error.response.status);
      } else if (error.response.status== 403) {  
        throw new TooManyRequestError("Exceeded Github rate limit", error.response.status);
      } else if (error.response.status >= 500) {  
        throw new InternalServerError("Could not fetch data from Github API", error.response.status);
      }
    }
  }

#formatRawData(data) {
  let commitDates = this.#getCommitDates(data);

  let commitsGroupedByPartOfDay = this.#groupCommitsByPartOfDay(commitDates);
  let commitGroupedByPartOfDayCount = this.#groupCommitsByPartOfDayCount(commitsGroupedByPartOfDay);
  let commitsGroupedByPartOfDayPercentage = this.#groupCommitsByPartOfDayPercentage(
    commitGroupedByPartOfDayCount,
    commitsGroupedByPartOfDay,
  );

  return commitsGroupedByPartOfDayPercentage;
}

#getCommitDates(data) {
  return data.map((commit) => {
    return commit.commit.author.date;
  });
}

#groupCommitsByPartOfDay(commitDates) {
  const timeZone = "America/New_York";

  return commitDates.map((date) => {
    let formattedHour = new Date(date).toLocaleString("en-US", {
      timeZone,
      hour: "numeric",
      hour12: false,
    });
    return this.#getPartOfDay(formattedHour);
  });
}

#groupCommitsByPartOfDayCount(commitsGroupedByPartOfDay) {
  return commitsGroupedByPartOfDay.reduce((commitsByPart, partOfDay) => {
    commitsByPart[partOfDay] = commitsByPart[partOfDay] || 0;
    commitsByPart[partOfDay]++;

    return commitsByPart;
  }, {});
}

#groupCommitsByPartOfDayPercentage(
  commitGroupedByPartOfDayCount,
  commitsGroupedByPartOfDay,
) {
  
  let commitGroupedByPercentage = {};

  for (const partOfDay in commitGroupedByPartOfDayCount) {
    commitGroupedByPercentage[partOfDay] = Math.round(
      (commitGroupedByPartOfDayCount[partOfDay] / commitsGroupedByPartOfDay.length) * 100,
    );
  }
  return commitGroupedByPercentage;
}

#getPartOfDay(hour) {
  const isMorning = hour >= 0 && hour < 12;
  const isAfternoon = hour >= 12 && hour <= 17;
  const isEvening = hour >= 18 && hour <= 20;
  const isNight = hour >= 21 && hour <= 23;

  if (isMorning) {
    return this.#PartOfDay.MORNING;
  } else if (isAfternoon) {
    return this.#PartOfDay.AFTERNOON;
  } else if (isEvening) {
    return this.#PartOfDay.EVENING;
  } else if (isNight) {
    return this.#PartOfDay.NIGHT;
  } else {
    console.log(`Error: unsupported value ${hour}`);
    return this.PartOfDay.UNKNOWN;
  }
}

}

module.exports = CommitFetcherService;
