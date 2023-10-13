const axios = require("axios");



class CommitFetcherService {
  
  PartOfDay = {
    MORNING: "morning",
    AFTERNOON: "afternoon",
    EVENING: "evening",
    NIGHT: "night",
    UNKNOWN: "unknown",
  };
  
  constructor(username, reponame, timezone) {
    this.username = username;
    this.reponame = reponame;
    this.timezone = timezone;
  }

  async fetchGitHubData() {
    try {
      const response = await axios.get(
        `https://api.github.com/repos/freddyhm/MyRepoStats/commits?per_page=100`,
      );

      if (response.status === 200) {
        return response.data;
      } else {  
        throw new Error(`Request failed with status: ${response.status}`);
      }
    } catch (error) { 
      throw error;
    }
  }

getPartOfDay(hour) {
  const isMorning = hour >= 0 && hour < 12;
  const isAfternoon = hour >= 12 && hour <= 17;
  const isEvening = hour >= 18 && hour <= 20;
  const isNight = hour >= 21 && hour <= 23;

  if (isMorning) {
    return this.PartOfDay.MORNING;
  } else if (isAfternoon) {
    return this.PartOfDay.AFTERNOON;
  } else if (isEvening) {
    return this.PartOfDay.EVENING;
  } else if (isNight) {
    return this.PartOfDay.NIGHT;
  } else {
    console.log(`Error: unsupported value ${hour}`);
    return this.PartOfDay.UNKNOWN;
  }
}

async getPartOfDayPercentageOfCommits() {
  try {
    let rawData = await this.fetchGitHubData();

    return this.formatRawData(rawData); // rename
  } catch (error) {
    console.error("Error:", error.message);
  }
}

formatRawData(data) {
  let commitDates = this.getCommitDates(data);

  let commitsGroupedByPartOfDay = this.groupCommitsByPartOfDay(commitDates);
  let commitGroupedByPartOfDayCount = this.groupCommitsByPartOfDayCount(commitsGroupedByPartOfDay);
  let commitsGroupedByPartOfDayPercentage = this.groupCommitsByPartOfDayPercentage(
    commitGroupedByPartOfDayCount,
    commitsGroupedByPartOfDay,
  );

  return commitsGroupedByPartOfDayPercentage;
}

getCommitDates(data) {
  return data.map((commit) => {
    return commit.commit.author.date;
  });
}

groupCommitsByPartOfDayPercentage(
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

groupCommitsByPartOfDayCount(commitsGroupedByPartOfDay) {
  return commitsGroupedByPartOfDay.reduce((commitsByPart, partOfDay) => {
    commitsByPart[partOfDay] = commitsByPart[partOfDay] || 0;
    commitsByPart[partOfDay]++;

    return commitsByPart;
  }, {});
}

groupCommitsByPartOfDay(commitDates) {
  const timeZone = "America/New_York";

  return commitDates.map((date) => {
    let formattedHour = new Date(date).toLocaleString("en-US", {
      timeZone,
      hour: "numeric",
      hour12: false,
    });
    return this.getPartOfDay(formattedHour);
  });
}
}

module.exports = CommitFetcherService;
