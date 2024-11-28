let fiveDayForecast = [];

// City Submission //
document.querySelector('#submit').addEventListener('click', function () {
  const cityInput = document.querySelector('#city-input');
  getLocation(cityInput.value);
  cityInput.value = '';
});
// Gets city latitude and longitude //
function getLocation(cityInput) {
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=5&appid=c09e162aa897c3130ce9f6bfd5698b9b`;
  fetch(url, {
    method: 'GET',
    dataType: 'json',
  })
  .then(data => data.json())
  .then(data => getWeather(data, cityInput));
};
// Gets one day weather data //
function getWeather(data, cityInput) {
  // turn cityInput into an array and always capitalize the start of words //
  const dataIndex = data.findIndex(data => data.name === cityInput);
  const dataLat = data[dataIndex].lat;
  const dataLon = data[dataIndex].lon;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${dataLat}&lon=${dataLon}&appid=c09e162aa897c3130ce9f6bfd5698b9b&units=imperial`;

  if (dataIndex === -1) {
    alert('Error: Error finding City information');
    return;
  } else {
    fetch(url, {
      method: 'GET',
      dataType: 'json'
    })
    .then(singleWeatherdata => singleWeatherdata.json())
    .then(singleWeatherdata => oneDayWeather(singleWeatherdata));
  };
};
// Adds current day weather to currWeather array //
function oneDayWeather(singleWeatherdata) {
  console.log(singleWeatherdata);
  const weatherData = singleWeatherdata;
  const data = {
    name: weatherData.name,
    temp: Math.floor(weatherData.main.temp),
    condition: weatherData.weather[0].description,
    imageURL: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
  };

  renderWeather(data);
};

function renderWeather(data) {
  const currWeatherDiv = document.querySelector('#current-weather');
  currWeatherDiv.replaceChildren();
  const currWeatherInfo = document.createElement('div');
  currWeatherInfo.className = 'col-lg-4 weather-info';
  const currWeatherImage = document.createElement('div');
  currWeatherImage.className = 'col-lg-4 weather-info';

  const infoTemplate = `
  <h2>${data.temp}</h2>
  <p>${data.name}</p>
  <p>${data.condition}</p>`;

  const imageTemplate = `<img src="${data.imageURL}"/>`;

  currWeatherDiv.appendChild(currWeatherInfo)
  currWeatherDiv.appendChild(currWeatherImage)
  currWeatherInfo.insertAdjacentHTML('beforeend', infoTemplate)
  currWeatherImage.insertAdjacentHTML('beforeend', imageTemplate)
}


// BUGS //
// 1. City name must be spelled perfectly or there is an error. Need to handle the errors without breaking the whole app.
// 2. Need to capitalize city names, even if they are not typed as such. This may not be needed if issue #1 is addressed in a way that makes this a non-issue

// TO-DO //
// 1. Write fetch request for 5 day forecast.
// 2. Make sure to only grab the info in the middle of the array, regardless of the length. I.E : 

// today = ['afternoon', 'early evening', 'evening', 'night]
// Tomorrow = ['early morning', 'morning', 'early afternoon', 'afternoon', 'early evening', 'evening', 'night']

// Todays weather will add all entries in the array and return the middle most one. In this case, 'early evening', or 'evening'.
// Tomorrows weather will return 'afternoon'.
 
// also, make sure each forecasted day has its own dive and is surrounded by a box to clearly identify it from the others.