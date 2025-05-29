'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWeatherBackground, isDay } from "@/lib/utils/weather";
import { getWeatherByCoordinates, getHistoricalWeather } from "@/lib/services/weather";
import { WeatherResponse, HistoricalWeatherResponse } from "@/lib/types/weather";
import { formatDateTime } from "@/lib/utils/date";
import { useEffect, useState } from "react";
import { WeatherChart } from '@/components/weather/WeatherChart';

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalWeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'historical' | 'forecast'>('historical');
  const [selectedPeriod, setSelectedPeriod] = useState<'1' | '3' | '30'>('1');
  const [showChart, setShowChart] = useState(false);
  const [location, setLocation] = useState<{ name: string, lat: number, lon: number }>({
    name: 'London',
    lat: 51.5073219,
    lon: -0.1276474
  });

  const locations = [
    {
      name: 'London',
      lat: 51.5073219,
      lon: -0.1276474,
      image: '/london.jpg'
    },
    {
      name: 'Chelsea',
      lat: 51.4875167,
      lon: -0.1687007,
      image: '/chelsea.jpg'
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [current, historical] = await Promise.all([
          getWeatherByCoordinates(location.lat, location.lon),
          getHistoricalWeather(location.lat, location.lon, selectedPeriod)
        ]);
        setWeatherData(current);
        setHistoricalData(historical);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch weather data');
        setLoading(false);
      }
    };

    fetchData();
  }, [location, selectedPeriod]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-700 text-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-opacity-50"></div>
          <p className="text-lg animate-pulse text-gray-300">Fetching the latest weather...</p>
        </div>
      </div>
    );
  }

  if (error || !weatherData) {
    return <div className="min-h-screen p-8 bg-gradient-to-b from-gray-900 to-gray-700 text-white">{error}</div>;
  }

  return (
    <main className={`min-h-screen p-8 bg-gradient-to-b ${getWeatherBackground(weatherData.weather[0].id, isDay(weatherData.sys.sunrise, weatherData.sys.sunset))}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Weather.com</h1>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {locations.map((loc) => (
            <button
              key={loc.name}
              onClick={() => setLocation(loc)}
              className={`relative overflow-hidden rounded-lg transition hover:scale-105 border-2
        ${location.name === loc.name ? 'border-blue-500' : 'border-transparent'}`}
            >
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center filter blur-sm brightness-75"
                style={{ backgroundImage: `url(${loc.image})` }}
              ></div>

              {/* Overlay content */}
              <div className="relative z-10 p-4 text-white flex flex-col justify-end h-40">
                <h2 className="text-xl font-semibold">{loc.name}</h2>
                <p className="text-sm">Lat: {loc.lat.toFixed(2)}, Lon: {loc.lon.toFixed(2)}</p>
              </div>

              {/* Gradient overlay for better readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0"></div>
            </button>
          ))}
        </div>


        {/* Main Weather Card */}
        <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 text-white mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-4xl mb-2">{Math.round(weatherData.main.temp)}°C</CardTitle>
              <p className="text-xl">{weatherData.name}, {weatherData.sys.country}</p>
              <p className="text-sm text-gray-400" title={formatDateTime(weatherData.dt).utc}>
                {formatDateTime(weatherData.dt).local}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm capitalize">{weatherData.weather[0].description}</p>
              <img
                src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt={weatherData.weather[0].description}
                width={50}
                height={50}
              />
            </div>
          </CardHeader>
        </Card>

        {/* Weather Details */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 text-white">
            <CardContent className="p-4">
              <p className="text-sm text-gray-400">Feels Like</p>
              <p className="text-xl font-semibold">{Math.round(weatherData.main.feels_like)}°C</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 text-white">
            <CardContent className="p-4">
              <p className="text-sm text-gray-400">Humidity</p>
              <p className="text-xl font-semibold">{weatherData.main.humidity}%</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 text-white">
            <CardContent className="p-4">
              <p className="text-sm text-gray-400">Wind Speed</p>
              <p className="text-xl font-semibold">{weatherData.wind.speed} m/s</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 text-white">
            <CardContent className="p-4">
              <p className="text-sm text-gray-400">Clouds</p>
              <p className="text-xl font-semibold">{weatherData.clouds.all}%</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 text-white">
            <CardContent className="p-4">
              <p className="text-sm text-gray-400">Pressure</p>
              <p className="text-xl font-semibold">{weatherData.main.pressure} hPa</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setActiveTab('historical')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'historical' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Historical Weather
            </button>
            <button
              onClick={() => setActiveTab('forecast')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'forecast' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Forecast Weather
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg p-4">
            {activeTab === 'historical' && (
              <div>
                <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value as '1' | '3' | '30')}
                    className="px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                  >
                    <option value="1">Last 24 Hours</option>
                    <option value="3">Last 3 Days</option>
                    <option value="30">Last 30 Days</option>
                  </select>
                  {historicalData && (
                    <button
                      onClick={() => setShowChart(prev => !prev)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                    >
                      {showChart ? 'Show chart' : 'Hide chart'}
                    </button>
                  )}
                </div>

                {showChart && historicalData && (
                  <WeatherChart data={historicalData} />
                )}

                {historicalData && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {historicalData.list.map((item, index) => (
                      <Card
                        key={index}
                        className="bg-gray-800/60 backdrop-blur-lg border border-gray-700 text-white hover:shadow-lg transition-shadow duration-200"
                      >
                        <CardContent className="p-4 space-y-2">
                          {/* Date/Time */}
                          <div className="text-gray-400 text-sm" title={formatDateTime(item.dt).utc}>
                            {formatDateTime(item.dt).local}
                          </div>

                          {/* Temperature and Icon */}
                          <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold">{Math.round(item.main.temp)}°C</div>
                            <img
                              src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                              alt={item.weather[0].description}
                              className="w-10 h-10"
                            />
                          </div>

                          {/* Description */}
                          <div className="capitalize text-sm text-gray-300">{item.weather[0].description}</div>

                          {/* Weather Stats */}
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-200 mt-2">
                            <div className="bg-gray-700/50 p-2 rounded-lg text-center">
                              <p className="font-semibold">{item.main.humidity}%</p>
                              <p className="text-xs text-gray-400">Humidity</p>
                            </div>
                            <div className="bg-gray-700/50 p-2 rounded-lg text-center">
                              <p className="font-semibold">{item.wind.speed} m/s</p>
                              <p className="text-xs text-gray-400">Wind</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                  </div>
                )}
              </div>
            )}

            {activeTab === 'forecast' && (
              <div className="text-white text-center py-8">
                Forecast weather coming soon...
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
