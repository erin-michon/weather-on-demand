// **  VARIABLES **
let userFormEl = document.querySelector("#search-form");
let cityInputEl = document.querySelector("#city");
let fiveDayContainerEl = document.querySelector("#five-day-container");
let currentDayContainerEl = document.querySelector("#current-day-container");
let currentWeatherContainerEl = document.querySelector("#current-weather-container");
let futureWeatherContainerEl = document.querySelector("#future-weather-container");
let searchedCitiesEl = document.querySelector("#searched-cities");
let currentWeather;
let cityLat;
let cityLon;
let city;
let searchedCities = [];

// ** TIME CONVERSION **
let today = moment().format("L")
console.log(today); 

// ** FORM HANDLERS **
let formSubmitHandler = function(event) {
  // prevent page from refreshing
  event.preventDefault();

  //get value from input element
  let city = cityInputEl.value.trim();

  if (city) {

    getCurrentWeather(city);

    //clear old content
    currentDayContainerEl.innerHTML="";
    fiveDayContainerEl.innerHTML="";
    currentWeatherContainerEl.innerHTML="";
    futureWeatherContainerEl.innerHTML="";
    cityInputEl.value = "";

    if(searchedCities.indexOf(city) === -1) {
      
      searchedCities.push(city);
      let searchedCityBtn = document.createElement("button");
      searchedCityBtn.classList="storage-btn btn col-12";
      searchedCityBtn.textContent= city;
      searchedCitiesEl.appendChild(searchedCityBtn);

      console.log(searchedCities);
      
      saveCities();
      
    }

    
  }else{
    alert("Please enter a city name");
  }
}

// ** SAVE FUNCTION - saving to local.Storage
let saveCities = function() { 
    localStorage.setItem("searchedCities", JSON.stringify(searchedCities));
};

// ** LOAD STORAGE FUNCTION - Loads the previously searched cities when the browser is refreshed
var loadCities = function() {
  //get data from localStorage
  searchedCities = localStorage.getItem("searchedCities", searchedCities);

  //check to see if anything exists:
  if (!searchedCities) {
      return false;
    }
  
  //turn it back into an object
  searchedCities = JSON.parse(searchedCities);

  //iterate through the searchedCities Array and create/append buttons
  for (let i = 0; i < searchedCities.length; i++) {
         
    let searchedCityBtn = document.createElement("button");
    searchedCityBtn.classList="storage-btn btn col-12";
    searchedCityBtn.textContent= searchedCities[i];
    searchedCitiesEl.appendChild(searchedCityBtn);
  }
   
};   

//  ** FUNCTIONS TO FETCH API DATA
let getCurrentWeather = function(city) {
  // format the api url   
  var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + "451c5c4eda0758c7a53f2fee96ca99f8";

 
  // make a get request to url
  fetch(apiUrl)
  .then(function(response) {
    // request was successful
    if (response.ok) {
      //return the json object of the data requested
      response.json().then(function(data) {
        
        //requested city lattitude and longitude - needs to be sent to second api fetch for future forecast info and uv index
        cityLat = data.coord.lat;
        cityLon = data.coord.lon;
                    
        //send data to displayCurrentWeather based on avail info
        getFutureWeather(cityLat,cityLon);
        displayCurrentWeather(data, city);
        
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
  var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&units=imperial&exclude=minutely,hourly,alerts&appid=451c5c4eda0758c7a53f2fee96ca99f8";
 
  // make a get request to url
  fetch(apiUrl)
  .then(function(response) {
    // request was successful
    if (response.ok) {
      //return the json object of the data requested
      response.json().then(function(data) {
        
        //Initiate future weather data function
        displayFutureWeather(data);

      });     

    } else {
      
      alert("Error: " + response.statusText);
    }})
  .catch(function(error) {
    alert("Unable to connect to Open Weather");
  });
};

// ** FUNCTIONS TO DISPLAY DATA
let displayCurrentWeather = function(data, city) {

  currentWeatherContainerEl.classList= "current-weather current-border";

  // create elements and populate for current date
  let titleEl = document.createElement("div");
  titleEl.classList = "current-day-title";
  titleEl.textContent = city + " (" + today + ") ";
  let titleImgEl = document.createElement("img");
  imgIcon = data.weather[0].icon;
  titleImgEl.setAttribute("src", "http://openweathermap.org/img/wn/" + imgIcon + "@2x.png" );
  currentDayContainerEl.appendChild(titleEl);
  titleEl.appendChild(titleImgEl);
 
  let tempEl = document.createElement("div"); 
  tempEl.classList = "day-info";
  tempEl.textContent = "Temp: " + data.main.temp + " °F"
  currentDayContainerEl.appendChild(tempEl)
  
  let windEl = document.createElement("div"); 
  windEl.classList = "day-info";
  windEl.textContent = "Wind: " + data.wind.speed + " MPH";
  currentDayContainerEl.appendChild(windEl)
  
  var humidityEl = document.createElement("div"); 
  humidityEl.classList = "day-info";
  humidityEl.textContent = "Humidity: " + data.main.humidity + "%";
  currentDayContainerEl.appendChild(humidityEl);

  // append container to the dom
  currentWeatherContainerEl.appendChild(currentDayContainerEl);

};

let displayFutureWeather = function(data) {
  // check if api returned any results
  if (data.daily.length === 0) {
    alert("No weather information found.");
    return;
  }

  //get and attach uv element to today's weather section
  var uvEl = document.createElement("div");
  uvEl.classList = "uv day-info";
  uvEl.textContent = "UV Index: " + data.current.uvi;
  currentWeatherContainerEl.appendChild(uvEl);

  //create and display title
  var futureTitleEl = document.createElement("div");
  futureTitleEl.classList = "five-day-title";
  futureTitleEl.textContent = "5-Day Forecast";
  futureWeatherContainerEl.appendChild(futureTitleEl);


  // display currentWeather data
  for (var i = 1; i < (data.daily.length - 2); i++) {

    // format dateBlock name
    var dateBlock = moment().add(i, 'days').format("L");

    // create a div and title for each dayblock
    var dayEl = document.createElement("div");
    dayEl.classList = "date-block card col";
    var titleEl = document.createElement("h4");
    titleEl.textContent = dateBlock;

    // append to container
    dayEl.appendChild(titleEl);

    // create an image element
    var imgEl = document.createElement("img");
    imgEl.classList = "weather-icon col-2";
    imgIcon = data.daily[i].weather[0].icon
    imgEl.setAttribute("src", "http://openweathermap.org/img/wn/" + imgIcon + "@2x.png" );
    
    //append to container
    dayEl.appendChild(imgEl);

    // create remaining weather info
    var tempEl = document.createElement("div");
    tempEl.classList = "day-temp card-text";
    tempEl.textContent = "Temp: " + data.daily[1].temp.day + " °F"
    dayEl.appendChild(tempEl)

    var windEl = document.createElement("div"); 
    windEl.classList = "day-wind card-text";
    windEl.textContent = "Wind: " + data.daily[1].wind_speed + " MPH";
    dayEl.appendChild(windEl)

    var humidityEl = document.createElement("div"); 
    humidityEl.classList = "day-humidity card-text";
    humidityEl.textContent = "Humidity: " + data.daily[i].humidity + "%";
    dayEl.appendChild(humidityEl)

    // append container to the dom
    fiveDayContainerEl.appendChild(dayEl);
  }

};

// **EVENT LISTENERS
userFormEl.addEventListener("submit", formSubmitHandler);

// **FUNCTION CALLS
// loadCities();

