import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AddCity from './AddCity';
import useLocation from './location'; 

function App() {
  const [weatherData, setWeatherData] = useState([]);
  const { userLocation, getUserLocation } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);
  

  const navigate = useNavigate();

  useEffect(() => {
    fetchWeatherData();
    const isConnected = localStorage.getItem('connected');
    if (isConnected) {
      setConnected(true);
    }
  }, []);

  const fetchWeatherData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://backend-weather-app-w4sa-a4b1rk2gv-alune62s-projects.vercel.app/weather');
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }

    getUserLocation();
  };



  const addCity = async (cityName) => {
    if (!connected) {
      alert("Vous devez vous connecter d'abord");
      navigate("/login");
      return;
    }

    if (!cityName) return;

    try {
      const response = await fetch(`https://backend-weather-app-w4sa-a4b1rk2gv-alune62s-projects.vercel.app/weather`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({ cityName: cityName })
      });
      const data = await response.json();
      console.log(data);
      if(data.result){
        setWeatherData(prevData => ({
        ...prevData,
        weather: [...prevData.weather, data.weather]
      }));
      } else {
        setError(data.error)
        alert("cette Ville existe déjà")
      }
      
    } catch (error) {
      console.error("Error adding city:", error);
    }
  };

  const deleteCity = (cityName) => {
    if (window.confirm("Are you sure you want to delete this city?")) {
      fetch(`https://backend-weather-app-w4sa-a4b1rk2gv-alune62s-projects.vercel.app/weather/${cityName}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
          if (data.result) {
            fetchWeatherData();
          }
        })
        .catch(error => {
          console.error("Error deleting city:", error);
        });
    }
  };

  const handleUserButtonClick = () => {
    if (connected) {
      localStorage.removeItem('connected');
      setConnected(false);
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return (
    <div>
      {error && <p className="error">{error.message}</p>}
      {isLoading && <p className="loading">Chargement...</p>}

      <div id="header">
        <Link to="/" id="logoButton">
          <img id="logo" src="images/logo.svg" alt="Logo" />
        </Link>

        <div className="headerDiv">
          <AddCity onAddCity={addCity} />
        </div>
        <button onClick={handleUserButtonClick} id="userButton">
          <img id="userIcon" src="images/user.png" alt="User" />
          {connected ? "Logout" : "Login"}
        </button>
      </div>

      <div id="cityList">
        {userLocation && (
          <div className="cityContainer" key={userLocation.cityName}>
            <p className="name">{userLocation.cityName}</p>
            <p className="temperature">{userLocation.temp}°C</p>
            <p className="description">{userLocation.description}</p>
            <img className="weatherIcon" src={`images/${userLocation.main}.png`} alt={userLocation.main} />
            <div className="temperature">
              <p className="tempMin">{userLocation.tempMin}°</p>
              <span>-</span>
              <p className="tempMax">{userLocation.tempMax}°</p>
            </div>
            <button className="deleteCity">Delete</button>
          </div>
        )}

        {weatherData && weatherData.weather && weatherData.weather.map(city => (
          <div className="cityContainer" key={city.cityName}>
            <p className="name">{city.cityName}</p>
            <p className='temperature'>{Math.floor(city.temp)}°C</p>
            <p className="description">{city.description}</p>
            <img className="weatherIcon" src={`images/${city.main}.png`} alt={city.main} />
            <div className="temperature">
              <p className="tempMin">{Math.floor(city.tempMin)}°C</p>
              <span>-</span>
              <p className="tempMax">{Math.floor(city.tempMax)}°C</p>
            </div>
            <button className="deleteCity" onClick={() => deleteCity(city.cityName)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
