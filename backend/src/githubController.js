const axios = require("axios");

async function fetchGitHubData() {
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

const PartOfDay = {
  MORNING: "Morning",
  AFTERNOON: "Afternoon",
  EVENING: "Evening",
  NIGHT: "Night",
  UNKNOWN: "Unknown",
};

function getPartOfDay(hour) {
  const isMorning = hour >= 0 && hour < 12;
  const isAfternoon = hour >= 12 && hour <= 17;
  const isEvening = hour >= 18 && hour <= 20;
  const isNight = hour >= 21 && hour <= 23;

  if (isMorning) {
    return PartOfDay.MORNING;
  } else if (isAfternoon) {
    return PartOfDay.AFTERNOON;
  } else if (isEvening) {
    return PartOfDay.EVENING;
  } else if (isNight) {
    return PartOfDay.NIGHT;
  } else {
    console.log(`Error: unsupported value ${hour}`);
    return PartOfDay.UNKNOWN;
  }
}

async function getPartOfDayPercentageOfCommits() {
  try {
    let rawData = await fetchGitHubData();

    return formatRawData(rawData); // rename
  } catch (error) {
    console.error("Error:", error.message);
  }

  function formatRawData(data) {
    let commitDates = getCommitDates(data);

    let commitsGroupedByPartOfDay = groupCommitsByPartOfDay(commitDates);
    let commitGroupedByPartOfDayCount = groupCommitsByPartOfDayCount(commitsGroupedByPartOfDay);
    let commitsGroupedByPartOfDayPercentage = groupCommitsByPartOfDayPercentage(
      commitGroupedByPartOfDayCount,
      commitsGroupedByPartOfDay,
    );

    return commitsGroupedByPartOfDayPercentage;
  }

  function getCommitDates(data) {
    return data.map((commit) => {
      return commit.commit.author.date;
    });
  }

  function groupCommitsByPartOfDayPercentage(
    commitGroupedByPartOfDayCount,
    commitsGroupedByPartOfDay,
  ) {
    let commitGroupedByPercentage = [];

    for (const partOfDay in commitGroupedByPartOfDayCount) {
      commitGroupedByPercentage[partOfDay] = Math.round(
        (commitGroupedByPartOfDayCount[partOfDay] / commitsGroupedByPartOfDay.length) * 100,
      );
    }
    return commitGroupedByPercentage;
  }

  function groupCommitsByPartOfDayCount(commitsGroupedByPartOfDay) {
    return commitsGroupedByPartOfDay.reduce((commitsByPart, partOfDay) => {
      commitsByPart[partOfDay] = commitsByPart[partOfDay] || 0;
      commitsByPart[partOfDay]++;

      return commitsByPart;
    }, {});
  }

  function groupCommitsByPartOfDay(commitDates) {
    const timeZone = "America/New_York";

    return commitDates.map((date) => {
      let formattedHour = new Date(date).toLocaleString("en-US", {
        timeZone,
        hour: "numeric",
        hour12: false,
      });
      return getPartOfDay(formattedHour);
    });
  }
}

module.exports = {
  getPartOfDayPercentageOfCommits,
};
