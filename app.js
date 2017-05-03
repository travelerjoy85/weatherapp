(function(){
// We need to access darksky url
var DARKSKY_API_URL = 'https://api.darksky.net/forecast/';
// we need the key to access the data
var DARKSKY_API_KEY = '698fc3089e6806f7e0c497e21987b039';
// we need cors_proxy to pass our API key for security reason
var CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

// We need the key to access the data
var GOOGLE_MAPS_API_KEY = 'AIzaSyBYXzpKdO-i1Y0hETi0Fkr2ZkBzJ9y6ll8';
// we need to access the url of google map api
var GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

var transform = {};
transform['clear-day'] = `<img src="./img/clearday.png" style="width: 50px">`
transform['clear-night'] = `<img src="./img/clearnight.png" style="width: 50px">`
transform['rain'] = `<img src="./img/rain.png" style="width: 50px">`
transform['snow'] = `<img src="./img/snow.png" style="width: 50px">`
transform['leet'] = `<img src="./img/leet.png" style="width: 50px">`
transform['wind'] = `<img src="./img/wind.png" style="width: 50px">`
transform['fog'] = `<img src="./img/fog.png" style="width: 50px">`
transform['cloudy'] = `<img src="./img/cloudy.png" style="width: 50px">`
transform['partly-cloudy-day'] = `<img src="./img/partly-cloudy-day.png" style="width: 50px">`
transform['partly-cloudy-night'] = `<img src="./img/partly-cloudy-night.png" style="width: 50px">`
transform[0] = 'Sunday'
transform[1] = 'Monday'
transform[2] = 'Tuesday'
transform[3] = 'Wednesday'
transform[4] = 'Thursday'
transform[5] = 'Friday'
transform[6] = 'Saturday'

// This function returns a promise of object from which we can extract the data we need
function getCoordinatesForCity(cityName){
    // This is an ES6 template string, much better than verbose string cancatenation.
    var url = `${GOOGLE_MAPS_API_URL}?address=${cityName}&key=${GOOGLE_MAPS_API_KEY}`;

    return(
      fetch(url) // returns a promise for a response. Fetch the data (a json string from the url)
      .then(response => response.json()) // returns a promise for the parsed json: convert the string to object
      .then(data => data.results[0].geometry.location) // Transform the response to only take what we need: retrieve only the data we need from the parsed object
    );

}
// getCoordinatesForCity("Montreal").then(console.log);

function getCurrentWeather(coords) {
  // another template string
  var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}?units=si`;

  return(
    fetch(url)
    .then(response => response.json())
    .then((data) => {
      // console.log('data' data)
      return [
              data.currently,
              data.daily.data[0],
              data.daily.data[1],
              data.daily.data[2],
              data.daily.data[3],
              data.daily.data[4],
              data.daily.data[5],
              data.daily.data[6]
            ];
    })
  );
}

// getCurrentWeather({lat: 45.5, lng: -73.5}).then(console.log);

// Create one variable for each of the DOM element that we will need to target later
var app = document.querySelector('#app');
var cityForm = app.querySelector('.city-form');
var cityInput = cityForm.querySelector('.city-input');
// var getWeatherButton = cityForm.querySelector('.get-weather-button');
var cityWeather = app.querySelector('.city-weather');

// Method 1: This is not the best way to do it cause if you enter a city name and press enter, it submits the form by default
/*
getWeatherButton.addEventListener('click', function(){
  var city = cityInput.value; // grab the current value of the user input

  getCoordinatesForCity(city) // get the coordinates for the input city
  .then(getCurrentWeather) // get the weather for those coordinates
  .then(function(weather){
    cityWeather.innerText = 'Current temperature: ' + weather.temperature;
  });
});
*/

// Method 2: This is a better way to do it
/*
1. Go back to HTML, change "button type = 'button'" to "button type = 'submit'"
   This means now, whether you click the button or press enter, the form will first fire off a submit event
2. Change the event code as follows:
*/
cityForm.addEventListener('submit', function(event){ // This line changes
  event.preventDefault(); // to prevent the form from submitting


  var city = cityInput.value; // This line doesn't change, it's to grab the current of the user input
  cityWeather.innerHTML = "loading...";

  getCoordinatesForCity(city) // get the coordinates for the input city
  .then(getCurrentWeather) // get the weather for those coordinates
  .then((result) => {

  // if(cityWeather.innerHTML=""){
  //   document.body.style.backgroundImage = `url(./img/weather.gif)`;
  //   document.body.style.backgroundSize = `cover`;
  //   document.body.style.backgroundRepeat = `no-repeat`;
  //   document.body.style.backgroundPosition = `0 0 15px 0`;
  // }

  if(result[0].temperature < -30){
        document.body.style.backgroundImage = `url(./img/extreme-winter-big.gif)`;
        document.body.style.backgroundSize = `cover`;
        document.body.style.backgroundRepeat = `no-repeat`;
        document.body.style.backgroundPosition = `0 0 15px 0`;
      }
  else if(result[0].temperature > -30 && result[0].temperature < 0){
        document.body.style.backgroundImage = `url(./img/winter.gif)`;
        document.body.style.backgroundSize = `cover`;
        document.body.style.backgroundRepeat = `no-repeat`;
        document.body.style.backgroundPosition = `0 0 15px 0`;
      }
  else if(result[0].temperature > 0 && result[0].temperature < 10){
        document.body.style.backgroundImage = `url(./img/autumn.gif)`;
        document.body.style.backgroundSize = `cover`;
        document.body.style.backgroundRepeat = `no-repeat`;
        document.body.style.backgroundPosition = `0 0 15px 0`;
      }
  else if(result[0].temperature > 10 && result[0].temperature < 25){
        document.body.style.backgroundImage = `url(./img/spring.gif)`;
        document.body.style.backgroundSize = `cover`;
        document.body.style.backgroundRepeat = `no-repeat`;
        document.body.style.backgroundPosition = `0 0 15px 0`;
      }
  else{
        document.body.style.backgroundImage = `url(./img/summer.gif)`;
        document.body.style.backgroundSize = `cover`;
        document.body.style.backgroundRepeat = `no-repeat`;
        document.body.style.backgroundPosition = `0 0 15px 0`;
      }

      return cityWeather.innerHTML = `
        <div class="separateDays">
          <div class="day"><p>Today</p></div>
          <div class="degree">${transform[result[0].icon]}<h3>Currently: ${result[0].temperature}°C</h3></div>
        </div>

        <div class="separateDays">
          <div class="day"><p>${transform[new Date(result[1].time * 1000).getDay()]}</p></div>
          <div class="degree">${transform[result[1].icon]}<h3>Min: ${result[1].temperatureMin}°C<br>Max: ${result[1].temperatureMax}°C</h3></div>
        </div>

        <div class="separateDays">
          <div class="day"><p>${transform[new Date(result[2].time * 1000).getDay()]}</p></div>
          <div class="degree">${transform[result[2].icon]}<h3>Min: ${result[2].temperatureMin}°C<br>Max: ${result[2].temperatureMax}°C</h3></div>
        </div>

        <div class="separateDays">
          <div class="day"><p>${transform[new Date(result[3].time * 1000).getDay()]}</p></div>
          <div class="degree">${transform[result[3].icon]}<h3>Min: ${result[3].temperatureMin}°C<br>Max: ${result[3].temperatureMax}°C</h3></div>
        </div>

        <div class="separateDays">
          <div class="day"><p>${transform[new Date(result[4].time * 1000).getDay()]}</p></div>
          <div class="degree">${transform[result[4].icon]}<h3>Min: ${result[4].temperatureMin}°C<br>Max: ${result[4].temperatureMax}°C</h3></div>
        </div>

        <div class="separateDays">
          <div class="day"><p>${transform[new Date(result[5].time * 1000).getDay()]}</p></div>
          <div class="degree">${transform[result[5].icon]}<h3>Min: ${result[5].temperatureMin}°C<br>Max: ${result[5].temperatureMax}°C</h3></div>
        </div>

        <div class="separateDays">
          <div class="day"><p>${transform[new Date(result[6].time * 1000).getDay()]}</p></div>
          <div class="degree">${transform[result[6].icon]}<h3>Min: ${result[6].temperatureMin}°C<br>Max: ${result[6].temperatureMax}°C</h3></div>
        </div>

      `
  });
//  getCoordinatesForCity('montreal').then(result => console.log(result, 'hello!!!!!'));

})
})();
