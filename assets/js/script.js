/*
** ACCEPTANCE CRITERIA **
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city   

*/
// **  VARIABLES **
let currentWeather;
let cityLat;
let cityLon;


let getCurrentWeather = function(city) {
  // format the api url   "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + "451c5c4eda0758c7a53f2fee96ca99f8"  "https://api.openweathermap.org/data/2.5/weather?q=detroit&appid=451c5c4eda0758c7a53f2fee96ca99f8"
  var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=detroit&appid=451c5c4eda0758c7a53f2fee96ca99f8";
 
  // make a get request to url
  fetch(apiUrl)
  .then(function(response) {
    // request was successful
    if (response.ok) {
      console.log(response);
      //return the json object of the data requested
      response.json().then(function(data) {
        
        //requested city lattitude and longitude - needs to be sent to second api fetch for future forecast info and uv index
        cityLat = data.coord.lat;
        cityLon = data.coord.lon;
        
        getFutureWeather(cityLat,cityLon);

        console.log(cityLat);
        console.log(cityLon);
        
        //send data to displayCurrentWeather based on avail info
        console.log(data.name);
        console.log(data.main.temp);
        console.log(data.main.humidity);
        console.log(data.wind.speed);
        console.log(data);
        
      });

    } else {
      
      alert("Error: " + response.statusText);
    }})
  .catch(function(error) {
    alert("Unable to connect to Open Weather");
  });
};

let getFutureWeather = function(lat, lon) {
  // format the api url  using info from first fetch (passed through fxn)
  var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&exclude=hourly,daily&appid=451c5c4eda0758c7a53f2fee96ca99f8";
 
  // make a get request to url
  fetch(apiUrl)
  .then(function(response) {
    // request was successful
    if (response.ok) {
      console.log(response);
      //return the json object of the data requested
      response.json().then(function(data) {
        
        console.log(data);
        
      });

    } else {
      
      alert("Error: " + response.statusText);
    }})
  .catch(function(error) {
    alert("Unable to connect to Open Weather");
  });
};



/* 
let displayCurrentWeather = function(data, city) {
  // check if api returned any results
  if (city.length === 0) {
    repoContainerEl.textContent = "No information found.";
    return;
  }

  citySearchTerm.textContent = searchTerm;

  // display currentWeather data
  for (var i = 0; i < repos.length; i++) {
    // format repo name
    var repoName = repos[i].owner.login + "/" + repos[i].name;

    // create a link for each repo
    var repoEl = document.createElement("a");
    repoEl.classList = "list-item flex-row justify-space-between align-center";
    repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

    // create a span element to hold repository name
    var titleEl = document.createElement("span");
    titleEl.textContent = repoName;

    // append to container
    repoEl.appendChild(titleEl);

    // create a status element
    var statusEl = document.createElement("span");
    statusEl.classList = "flex-row align-center";

    // check if current repo has issues or not
    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML =
        "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
    } else {
      statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    // append to container
    repoEl.appendChild(statusEl);

    // append container to the dom
    repoContainerEl.appendChild(repoEl);
  }
};
*/




getCurrentWeather();




