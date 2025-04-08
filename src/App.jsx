import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { WiDaySunny, WiRain, WiSnow, WiCloudy, WiDayHaze } from 'react-icons/wi'
import axios from 'axios'

const API_KEY = '08507989da8a69d39501ea2775cdb920'
const CURRENT_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast'

function App() {
  // Weather Dashboard States
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [recentSearches, setRecentSearches] = useState([])
  
  // Theme State for Dark/Light toggle
  const [theme, setTheme] = useState('light')
  
  // Returns weather icon based on condition
  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <WiDaySunny className="text-6xl text-yellow-400" />
      case 'rain':
        return <WiRain className="text-6xl text-blue-400" />
      case 'snow':
        return <WiSnow className="text-6xl text-gray-200" />
      case 'clouds':
        return <WiCloudy className="text-6xl text-gray-400" />
      default:
        return <WiDayHaze className="text-6xl text-gray-500" />
    }
  }

  // Fetch current weather data
  const fetchWeather = async (searchCity) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await axios.get(CURRENT_WEATHER_URL, {
        params: {
          q: searchCity,
          appid: API_KEY,
          units: 'metric'
        }
      })
      setWeather(response.data)
      
      // Update recent searches (maximum of 5, no duplicates)
      setRecentSearches(prev => {
        const updated = [searchCity, ...prev.filter(s => s !== searchCity)]
        return updated.slice(0, 5)
      })
      
      // After fetching current weather, get the forecast
      fetchForecast(searchCity)
    } catch (err) {
      setError('City not found or API error. Please try again.')
      setWeather(null)
      setForecast(null)
    } finally {
      setLoading(false)
    }
  }

  // Fetch 5-Day Forecast data
  const fetchForecast = async (searchCity) => {
    try {
      const response = await axios.get(FORECAST_URL, {
        params: {
          q: searchCity,
          appid: API_KEY,
          units: 'metric'
        }
      })
      // Filter the forecast list to one entry per day
      const filteredForecast = response.data.list.filter((item, index) => index % 8 === 0)
      setForecast(filteredForecast)
    } catch (err) {
      console.error('Forecast API error:', err)
      // Not critical: do not block current weather display
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (city.trim()) {
      fetchWeather(city)
    }
  }

  const handleRecentSearch = (searchCity) => {
    setCity(searchCity)
    fetchWeather(searchCity)
  }
  
  // Toggle dark/light theme
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <div className={`${theme === 'light' ? 'bg-gradient-to-br from-blue-100 to-blue-200 text-gray-900' : 'bg-gray-900 text-gray-100'} min-h-screen py-8 px-4 transition-colors duration-500`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-center">Weather Dashboard</h1>
          <button 
            onClick={toggleTheme} 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name"
              className={`${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-gray-100'} flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center mb-4"
          >
            <motion.div 
              className="w-8 h-8 border-4 border-blue-500 border-solid rounded-full border-t-transparent animate-spin"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-100 text-red-700 rounded-lg mb-4"
          >
            {error}
          </motion.div>
        )}

        {weather && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} rounded-lg shadow-lg p-6 mb-8`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">
                {weather.name}, {weather.sys.country}
              </h2>
              <button
                onClick={() => fetchWeather(city)}
                className="text-blue-500 hover:text-blue-600"
              >
                ↻ Refresh
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                {getWeatherIcon(weather.weather[0].main)}
                <div className="ml-4">
                  <div className="text-4xl font-bold">
                    {Math.round(weather.main.temp)}°C
                  </div>
                  <div className="capitalize">
                    {weather.weather[0].description}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Humidity</span>
                  <span className="font-semibold">{weather.main.humidity}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Wind Speed</span>
                  <span className="font-semibold">{weather.wind.speed} km/h</span>
                </div>
                <div className="flex justify-between">
                  <span>Feels Like</span>
                  <span className="font-semibold">
                    {Math.round(weather.main.feels_like)}°C
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {forecast && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} rounded-lg shadow-lg p-6 mb-8`}
          >
            <h3 className="text-xl font-semibold mb-4">5-Day Forecast</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {forecast.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span>{new Date(item.dt_txt).toLocaleDateString()}</span>
                  <span className="font-semibold">
                    {Math.round(item.main.temp)}°C
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {recentSearches.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Recent Searches</h3>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((searchCity) => (
                <button
                  key={searchCity}
                  onClick={() => handleRecentSearch(searchCity)}
                  className="px-4 py-1 bg-white rounded-full text-sm text-gray-600 hover:bg-blue-50 transition-colors"
                >
                  {searchCity}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
