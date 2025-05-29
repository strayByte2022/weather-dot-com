export const getWeatherBackground = (weatherId: number, isDay: boolean): string => {
  // Weather condition codes: https://openweathermap.org/weather-conditions
  if (weatherId >= 200 && weatherId < 300) { // Thunderstorm
    return 'from-slate-900 to-purple-900';
  } else if (weatherId >= 300 && weatherId < 400) { // Drizzle
    return 'from-gray-700 to-gray-900';
  } else if (weatherId >= 500 && weatherId < 600) { // Rain
    return 'from-blue-900 to-gray-800';
  } else if (weatherId >= 600 && weatherId < 700) { // Snow
    return 'from-blue-100 to-blue-300';
  } else if (weatherId >= 700 && weatherId < 800) { // Atmosphere (mist, fog, etc)
    return 'from-gray-400 to-gray-600';
  } else if (weatherId === 800) { // Clear sky
    return isDay ? 'from-blue-400 to-blue-600' : 'from-blue-900 to-indigo-900';
  } else if (weatherId > 800) { // Clouds
    return isDay ? 'from-gray-300 to-gray-500' : 'from-gray-700 to-gray-900';
  }
  return 'from-gray-900 to-gray-700'; // Default
};

export const isDay = (sunrise: number, sunset: number): boolean => {
  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime >= sunrise && currentTime < sunset;
};