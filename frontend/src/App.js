import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [error, setError] = useState("");
  const [stat, setStat] = useState("");
  const [username, setUsername] = useState("");
  const [repoName, setRepoName] = useState("");
  const [timezone, setTimezoneChange] = useState("America/Montreal");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleRepoNameChange = (e) => {
    setRepoName(e.target.value);
  };

  const handleTimezoneChange = (e) => {
    setTimezoneChange(e.target.value);
  };

  function formatErrorMessage(error) {
    if (error.code === 'ERR_NETWORK') {      
      return "Error: Could not connect to the service :(";
    } else if (error.response.status === 400) {
      return "Error: " + error.response.data.error;
    } else if (error.response.status ===  404) {
      return "Error: Could not find username or repo name in Github. Make sure repo's visibility is public and try again.";
    } else if (error.response.status ===  429) {
      return "Error: Too many requests, try again in an hour.";
    } else if (error.response.status ===  500 && error.message.includes("Github API")) {
      return "Error: Could not fetch data from Github";  
    }else{
      return "Unknown error: something went wrong";
    }
  }

  const getStats = () => {
    axios
      .get(
        `${apiUrl}/api/stats/username/${username}/repo/${repoName}/?timezone=${timezone}`
      )
      .then((response) => {
        setStat(response.data.stat_content);
      })
      .catch((error) => {

        if (error.response.status === 404 && error.response.data.error === "Stat report was not found for username and repo") {
            const reportData = {
              username: username,
              reponame: repoName,
              timezone: timezone
            }
            axios
              .post(`${apiUrl}/api/stats/create`, reportData)
              .then((response) => {
                setStat(response.data.stat_content);
              })
              .catch((error) => {
                let error_message = formatErrorMessage(error);
                setError(error_message);
              })
        } else {
          console.log(error);
          let error_message = formatErrorMessage(error);
          setError(error_message);
        }
      });
  };

  return (
    <div className="App">
      <br />
      <div>
        <p>
          Github.com/
          <input
            type="text"
            placeholder="enter username"
            value={username}
            onChange={handleUsernameChange}
          />
          /
          <input
            type="text"
            placeholder="enter repo name"
            value={repoName}
            onChange={handleRepoNameChange}
          />
        </p>
        <p>
          Timezone:
          <select value={timezone} onChange={handleTimezoneChange}>
            <option value="America/Montreal">America/Montreal</option>
            <option value="America/Vancouver"> America/Vancouver</option>
          </select>
        </p>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <button onClick={getStats}>Get Stats</button>
      </div>
      <br />
      <div>
        <h2>When are commits typically made during the day?</h2>
        <br />
        <h3>Morning: {stat ? stat.morning : 0}%</h3>
        <br />
        <h3>Afternoon: {stat ? stat.afternoon : 0}%</h3>
        <br />
        <h3>Evening: {stat ? stat.evening : 0}%</h3>
        <br />
        <h3>Night: {stat ? stat.night : 0}%</h3>
      </div>
    </div>
  );
}

export default App;
