# Weather Dashboard

A modern, responsive weather application built with React and Vite that provides current weather conditions and 5-day forecasts for cities worldwide.

## Tech Stack

- **React** - Frontend library for building the user interface
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Framer Motion** - Animation library for smooth UI transitions
- **React Icons** - Icon library (Weather Icons specifically)
- **Axios** - HTTP client for API requests

## Features

- Current weather conditions display
- 5-day weather forecast
- Search history with quick access to previous searches
- Dark/Light theme toggle
- Responsive design for all device sizes
- Loading and error state handling
- Animated UI components

## Setup Instructions

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/weather-dashboard.git
   cd weather-dashboard
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Configure API key
   - Sign up for a free API key at [OpenWeatherMap](https://openweathermap.org/api)
   - Add your API key:
     ```
     API_KEY = '08507989da8a69d39501ea2775cdb920'
     ```

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## API Integration Details

This application uses the [OpenWeatherMap API](https://openweathermap.org/api) to retrieve weather data.

### API Endpoints Used

- Current Weather: `https://api.openweathermap.org/data/2.5/weather`
- 5-Day Forecast: `https://api.openweathermap.org/data/2.5/forecast` 

### Rate Limits

- Free tier: 1,000 API calls per day for free
- If you exceed these, 0.0015 USD per API call over the daily limit.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
