function getWeather() {
    //Configuración de la API
    const apiKey = '52f73fe1a9f44128c7c4ce91f49905f4'
    const city = document.getElementById('city').value
    // Cuando el usuario no ingresa ciudad 
    if (!city) {
        alert('Please enter a city')
        return
    }
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}` // Clima
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}` // Pronostico

    // Clima 
    fetch(currentWeatherUrl) // Realizo la solicitud HTTP con fetch, que toma como argumento el URL y devuelve una promesa
        // Cuando la solicitud se realiza con exito, se toma la respuesta y la convierte a formato json 
        /* response es el parametro que representa el objeto que contiene la respuesta de la solicitud HTTP
        Cuando realizas una solicitud HTTP mediante fetch, la respuesta no esta en formato json, si no que es una representación 
        de la respuesta del servidor. Para usar los datos de la respuesta de manera efectiva, necesitas convertir los datos
        a un objetivo JS
        */
        .then(response => response.json())
        // Cuando los datos del clima estan disponibles, los datos son pasados a la función displayWeather
        .then(resp => {
            displayWeather(resp)
            console.log(resp)
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error)
            alert('Error fetching current weather data, please try again')
        })
    // Pronostico
    fetch(forecastUrl)
        .then(response => response.json())
        .then(resp => {
            displayHourlyForecast(resp.list)
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error)
            alert('Error fetching hourly forecast data, please try again')
        })
}
// Actualizar el HTML con el Clima s
function displayWeather(resp) {
    const tempDivInfo = document.getElementById('temp-div')
    const weatherInfoDiv = document.getElementById('weather-info')
    const weatherIcon = document.getElementById('weather-icon')
    /*OpenWeatherMap API cuando recibe un codigo 404, es comun que devuelva un objeto JSON 
    con el campo message con informacion sobre el error */
    if (resp.code === '404') {
        weatherInfoDiv.innerHTML = `<p>${resp.message}</p>`;
    } else {
        const cityName = resp.name
        const temperature = Math.round(resp.main.temp - 273.15) // Convertimos a celcius
        const maxTemperature = Math.round(resp.main.temp_max - 273.5)
        const minTemperature = Math.round(resp.main.temp_min - 273.5)
        const mainInfo = resp.weather[0].main
        const description = resp.weather[0].description
        const iconCode = resp.weather[0].icon
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHtml = `
        <p>${temperature}°</p>
        <p>Min ${minTemperature}°</p>
        <p>Max ${maxTemperature}°</p>
        `
        const weatherHtml = `
        <p>${cityName}</p>
        <p>${description}</p>
        <p>${mainInfo}</p>
        `
        tempDivInfo.innerHTML = temperatureHtml
        weatherInfoDiv.innerHTML = weatherHtml
        weatherIcon.src = iconUrl
        weatherIcon.alt = description

        showImage()
    }
}
function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast')

    const next24Hours = hourlyData.slice(0, 8)

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
        /*getHours() es una funcion de JS que se usa para obtener la hora de un objeto de fecha
        Date */
        
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15); // Convert to Celsius
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `
        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    })
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon')
    weatherIcon.style.display = 'block'
}
