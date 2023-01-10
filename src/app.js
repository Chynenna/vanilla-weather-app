function formatDate(timestamp) {
    let date = new Date(timestamp);
    let hours = date.getHours();
    if (hours < 10) {
        hours = `0${hours}`;
    }
    let minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let day = days[date.getDay()];
    return `${day} ${hours}:${minutes}`;
}

function formatDay(foreDate) {
    let date = new Date(foreDate * 1000);
    let day = date.getDay();
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return days[day];
}

function weatherForecast(response){
    let forecast = response.data.daily;
    let forecastElement = document.querySelector("#weather-forecast");
    let forecastHTML = `<div class="row">`
    forecast.forEach(function(forecastDay, index){
        if(index < 6) {
        forecastHTML = forecastHTML + `
        <div class="col-2">
            <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
            <img src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" alt="" width="42">
            <div class="weather-forecast-temperatures">
                <span class="weather-forecast-temperature-max">${Math.round(forecastDay.temp.max)}°</span> 
                <span class="weather-forecast-temperature-min">${Math.round(forecastDay.temp.min)}°</span>
            </div>
        </div>`;
        }
    })
    forecastHTML = forecastHTML + `</div>`
    forecastElement.innerHTML = forecastHTML;
    
}

function getForecast(coordinates) {
    let apiKey = "2718952144ed077c12e7c160fb6fc351"
    let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
    axios.get(apiURL).then(weatherForecast);
}

function search(city){
    let apiKey = "0e1ea42ab98d62ef5c3bd1f9fae41cdd";
    let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    axios.get(apiURL).then(displayTemperature);
}

function handleSubmit(event){
    event.preventDefault();
    let cityInput = document.querySelector("#city-input");
    search(cityInput.value);
}

function displayTemperature(response) {
    celsiusTemperature = Math.round(response.data.main.temp);

    let temperatureElement = document.querySelector("#temperature");
    temperatureElement.innerHTML = celsiusTemperature;
    let cityElement = document.querySelector("#city");
    cityElement.innerHTML = response.data.name;
    let description = document.querySelector("#description");
    description.innerHTML = response.data.weather[0].description;
    let humidity = document.querySelector("#humidity");
    humidity.innerHTML = response.data.main.humidity;
    let wind = document.querySelector("#wind");
    wind.innerHTML = Math.round(response.data.wind.speed);
    let time = document.querySelector("#time");
    time.innerHTML = formatDate(response.data.dt * 1000);
    let icon = document.querySelector("#icon");
    icon.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
    icon.setAttribute("alt", `${response.data.weather[0].description}`);

    getForecast(response.data.coord);
}

function showFahrenheitTemperature(event) {
    event.preventDefault();
    let temperature = document.querySelector("#temperature");
    let fahrenheiTemperature = (celsiusTemperature * 9) / 5 + 32;
    temperature.innerHTML = Math.round(fahrenheiTemperature);
    celsiusLink.classList.remove("active");
    fahrenheitLink.classList.add("active");
}

function showCelsiusTemperature(event) {
    event.preventDefault();
    let temperature = document.querySelector("#temperature");
    temperature.innerHTML = celsiusTemperature;
    celsiusLink.classList.add("active");
    fahrenheitLink.classList.remove("active");
}

let celsiusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", showFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", showCelsiusTemperature);

search("Kyiv");