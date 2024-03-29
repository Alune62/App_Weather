// Location.jsx
import { useState } from 'react';

const useLocation = () => {
  const [userLocation, setUserLocation] = useState();

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://backend-weather-app-w4sa-2t5166gtd-alune62s-projects.vercel.app/cities/location?lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          setUserLocation({
            cityName: data.weather.cityName,
            temp: data.weather.temp,
            description: data.weather.description,
            main: data.weather.main,
            tempMin: data.weather.tempMin,
            tempMax: data.weather.tempMax
          });
        } catch (error) {
          console.error("Error fetching user's weather:", error);
        }
      });
    }
  };

  return { userLocation, getUserLocation };
};

export default useLocation;
