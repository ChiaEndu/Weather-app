const apiKey = "31543b25bc43cc9ace5b64a598e982ca"; // gitleaks:allow

// ========================
const searchBtn = document.getElementById('search-btn')
const cityInput = document.getElementById('city-input')

const cityName = document.getElementById('city-name')
const temperature = document.getElementById('temperature')
const description = document.getElementById('description')
const humidity = document.getElementById('humidity')
const wind = document.getElementById('wind')
const weatherIcon = document.getElementById('weather-icon')
const errorMessage = document.getElementById('error-message')
const dailyContainer = document.getElementById('daily')

// SEARCH BUTTON
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim()
  if (city) {
    getWeather(city)
    saveLastCity(city)
  }
})

// CURRENT WEATHER
async function getWeather (city) {
  errorMessage.textContent = ''

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    )

    if (!response.ok) {
      throw new Error('City not found')
    }

    const data = await response.json()

    cityName.textContent = `${data.name}, ${data.sys.country}`
    temperature.textContent = `🌡️ Temp: ${Math.round(data.main.temp)}°C`
    description.textContent = `🌥️ ${data.weather[0].description}`
    humidity.textContent = `💧 Humidity: ${data.main.humidity}%`
    wind.textContent = `🌬️ Wind: ${data.wind.speed} m/s`

    weatherIcon.src =
      `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`

    changeBackground(data.weather[0].main)
    getForecast(city)
  } catch (error) {
    errorMessage.textContent = 'City not found. Please try again.'
  }
}

// 5 DAY FORECAST
async function getForecast (city) {
  dailyContainer.innerHTML = ''

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    )

    const data = await response.json()

    const dailyData = data.list.filter(item =>
      item.dt_txt.includes('12:00:00')
    )

    dailyData.slice(0, 5).forEach(day => {
      const date = new Date(day.dt_txt)
      const dayName = date.toLocaleDateString('en-US', {
        weekday: 'short'
      })

      const forecastCard = document.createElement('div')
      forecastCard.classList.add('forecast-card')

      forecastCard.innerHTML = `
        <h4>${dayName}</h4>
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" />
        <p>${Math.round(day.main.temp)}°C</p>
        <p>${day.weather[0].main}</p>
      `

      dailyContainer.appendChild(forecastCard)
    })
  } catch (error) {
    console.log('Forecast error:', error)
  }
}

// BACKGROUND CHANGER
function changeBackground (weather) {
  if (weather === 'Clear') {
    document.body.style.background =
      'linear-gradient(to right, #fceabb, #f8b500)'
  } else if (weather === 'Rain') {
    document.body.style.background =
      'linear-gradient(to right, #4b79a1, #283e51)'
  } else if (weather === 'Clouds') {
    document.body.style.background =
      'linear-gradient(to right, #bdc3c7, #2c3e50)'
  } else {
    document.body.style.background =
      'linear-gradient(to right, #4facfe, #00f2fe)'
  }
}

// LOCAL STORAGE
function saveLastCity (city) {
  localStorage.setItem('lastCity', city)
}

function getLastCity () {
  return localStorage.getItem('lastCity') || ''
}

window.addEventListener('load', () => {
  const lastCity = getLastCity()
  if (lastCity) {
    cityInput.value = lastCity
    getWeather(lastCity)
  }
})
