let fiveDayForecast = [];
const key = 'c09e162aa897c3130ce9f6bfd5698b9b'

// City Submission //
document.querySelector('#submit').addEventListener('click', function () {
  const cityInput = document.querySelector('#city-input');
  if (!cityInput.value) {
    alert('Error: You must enter a city name to seach.')
  } else {
    getLocation(cityInput.value);
    cityInput.value = '';
  }
});

// Gets city latitude and longitude //
function getLocation(cityInput) {
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=5&appid=${key}&units=imperial`;
  fetch(url, {
    method: 'GET',
    dataType: 'json',
  })
  .then(data => data.json())
  .then(data => getWeather(data, cityInput));
};

// Gets five day forecast //
function getForecast(data, cityInput) {
  const dataIndex = data.findIndex(data => data.name.toLowerCase() === cityInput.toLowerCase());
  const dataLat = data[dataIndex].lat;
  const dataLon = data[dataIndex].lon;
  const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${dataLat}&lon=${dataLon}&appid=${key}&units=imperial`;
  fetch(url, {
    method: 'GET',
    dataType: 'json'
  })
  .then(forecastData => forecastData.json())
  .then(forecastData => renderForecast(forecastData))
}

// Gets one day weather data //
function getWeather(data, cityInput) {
  if (cityInput.split('.')[0].toLowerCase() == 'st') {
    cityInput = 'saint ' + cityInput.split('.')[1]
  }
  const dataIndex = data.findIndex(data => data.name.toLowerCase() === cityInput.toLowerCase());
  if (dataIndex === -1) {
    alert('Error: Error finding City information');
    return;
  } else {
    const dataLat = data[dataIndex].lat;
    const dataLon = data[dataIndex].lon;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${dataLat}&lon=${dataLon}&appid=${key}&units=imperial`;
    fetch(url, {
      method: 'GET',
      dataType: 'json'
    })
    .then(singleWeatherData => singleWeatherData.json())
    .then(singleWeatherData => oneDayWeather(singleWeatherData));
  };

  getForecast(data, cityInput)
};

// Adds current day weather to currWeather array //
function oneDayWeather(singleWeatherData) {
  const weatherData = singleWeatherData;
  const data = {
    name: weatherData.name,
    temp: Math.floor(weatherData.main.temp),
    condition: weatherData.weather[0].description,
    imageURL: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
  };

  renderCurrWeather(data);
};

// Renders Current Weather Data to Page // 
function renderCurrWeather(data) {
  const currWeatherDiv = document.querySelector('#current-weather');
  currWeatherDiv.replaceChildren();
  const currWeatherInfo = document.createElement('div');
  currWeatherInfo.className = 'col-md-2 weather-info';
  currWeatherInfo.id = 'currInfo'
  const currWeatherImage = document.createElement('div');
  currWeatherImage.className = 'col-md-2 weather-info';
  const currWeatherHeading = document.createElement('h1')
  currWeatherHeading.className = 'lead weather-info'
  currWeatherHeading.textContent = 'Currently:'
  const seperator = document.createElement('hr')

  const infoTemplate = `
  <h2>${data.temp}</h2>
  <p>${data.name}</p>`;

  const imageTemplate = `
  <p id="currDesc">${data.condition}</p>
  <img src="${data.imageURL}"/>`;

  currWeatherDiv.appendChild(currWeatherHeading)
  currWeatherDiv.appendChild(currWeatherInfo)
  currWeatherDiv.appendChild(currWeatherImage)
  currWeatherDiv.appendChild(seperator)
  currWeatherInfo.insertAdjacentHTML('beforeend', infoTemplate)
  currWeatherImage.insertAdjacentHTML('beforeend', imageTemplate)
}

// Renders five day forecast //
function renderForecast(forecastData) {
  const days = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const forecastArr = forecastData.list;

  const dayOne = forecastArr[0];
  const dayTwo = forecastArr[8];
  const dayThree = forecastArr[16]
  const dayFour = forecastArr[24]
  const dayFive = forecastArr[32]
  fiveDayForecast = [];
  fiveDayForecast.push(dayOne, dayTwo, dayThree, dayFour, dayFive)
  const forecastDiv = document.querySelector('#five-day-forecast');
  const forecastHeading = document.createElement('h1')
  forecastHeading.className = 'lead weather-info'
  forecastHeading.textContent = 'Five Day Forecast:'
  forecastDiv.replaceChildren();
  forecastDiv.appendChild(forecastHeading)
  
  fiveDayForecast.forEach(day => {
    const dailyWeatherInfo = document.createElement('div');
    dailyWeatherInfo.className = 'col weather-info forecast border';
    const temp = Math.floor(day.main.temp);
    const dayIndex = new Date(day.dt_txt)
    const dayOfWeek = dayIndex.getDay(days)

    const template = `
    <h2>${temp}</h2>
    <p>${days[dayOfWeek]}</p>
    <p>${day.weather[0].description}</p>
    <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"/>`;

    forecastDiv.appendChild(dailyWeatherInfo);
    dailyWeatherInfo.insertAdjacentHTML('beforeend', template)
  })

}