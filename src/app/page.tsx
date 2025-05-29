'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWeatherBackground, isDay } from "@/lib/utils/weather";
import { getWeatherByCoordinates, getHistoricalWeather } from "@/lib/services/weather";
import { WeatherResponse, HistoricalWeatherResponse } from "@/lib/types/weather";
import { formatDateTime } from "@/lib/utils/date";
import { useEffect, useState } from "react";

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalWeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'historical' | 'forecast'>('historical');
  const [selectedPeriod, setSelectedPeriod] = useState<'1' | '3' | '30'>('1');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // London coordinates
        const [current, historical] = await Promise.all([
          getWeatherByCoordinates(51.5073219, -0.1276474),
          getHistoricalWeather(51.5073219, -0.1276474)
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
  }, []);

  if (loading) {
    return <div className="min-h-screen p-8 bg-gradient-to-b from-gray-900 to-gray-700 text-white">Loading...</div>;
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
                <div className="mb-4">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value as '1' | '3' | '30')}
                    className="px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                  >
                    <option value="1">Last 24 Hours</option>
                    <option value="3">Last 3 Days</option>
                    <option value="30">Last 30 Days</option>
                  </select>
                </div>
                {historicalData && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {historicalData.list.map((item, index) => (
                      <Card key={index} className="bg-gray-800/50 backdrop-blur-lg border-gray-700 text-white">
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-400" title={formatDateTime(item.dt).utc}>
                             {formatDateTime(item.dt).local}
                           </p>
                          <p className="text-xl font-semibold mt-2">{Math.round(item.main.temp)}°C</p>
                          <p className="text-sm capitalize">{item.weather[0].description}</p>
                          <div className="mt-2 text-sm">
                            <p>Humidity: {item.main.humidity}%</p>
                            <p>Wind: {item.wind.speed} m/s</p>
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
