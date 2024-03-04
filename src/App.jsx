import '../styles/style.css';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import Login from './login';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [cityNameInput, setCityNameInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchWeatherData();
    // Vérifier l'état de connexion stocké dans le stockage local lors du chargement initial de l'application
    const isConnected = localStorage.getItem('connected');
    if (isConnected) {
      setConnected(true);
    }
  }, []);

  const fetchWeatherData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://backend-weather-3ngp8r2m2-alune62.vercel.app/weather');
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }

    // Récupérer la position de l'utilisateur lors du chargement initial
    getUserLocation();
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const API_KEY = 'ce7418650c86eae6629dfcfdda141c14';
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`)
          .then(response => response.json())
          .then(data => {
            const userLocationData = {
              cityName: data.name,
              main: data.weather[0].main,
              description: data.weather[0].description,
              temp: Math.floor(data.main.temp - 273.15),
              tempMin: Math.floor(data.main.temp_min - 273.15),
              tempMax: Math.floor(data.main.temp_max - 273.15),
            };
            setUserLocation(userLocationData);
          })
          .catch(error => {
            console.error("Error fetching user's weather:", error);
          });
      });
    }
  };

  const addCity = async () => {
    if (!connected) {
      alert("Vous devez vous connecter d'abord");
      navigate("/login");
      return;
    }
  
    if (!cityNameInput) return;
  
    try {
      const YOUR_API_KEY = 'ce7418650c86eae6629dfcfdda141c14';
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityNameInput}&appid=${YOUR_API_KEY}`);
      const data = await response.json();
  
      const newCityData = {
        cityName: data.name,
        main: data.weather[0].main,
        description: data.weather[0].description,
        temp: Math.floor(data.main.temp - 273.15),
        tempMin: Math.floor(data.main.temp_min - 273.15),
        tempMax: Math.floor(data.main.temp_max - 273.15),
      };
  
      // Mettre à jour l'état de weatherData en ajoutant la nouvelle ville
      setWeatherData(prevData => ({
        ...prevData,
        weather: [...prevData.weather, newCityData]
      }));
  
      // Réinitialiser le champ de saisie de la ville
      setCityNameInput('');
    } catch (error) {
      console.error("Error adding city:", error);
    }
  };
  
  

  const deleteCity = (cityName) => {
    if (window.confirm("Are you sure you want to delete this city?")) {
      fetch(`https://backend-weather-3ngp8r2m2-alune62.vercel.app/weather/${cityName}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
          if (data.result) {
            fetchWeatherData(); // Rafraîchir les données après la suppression
          }
        })
        .catch(error => {
          console.error("Error deleting city:", error);
        });
    }
  };

  const handleUserButtonClick = () => {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté, sinon déconnecter l'utilisateur
    if (connected) {
      // Supprimer l'état de connexion du stockage local
      localStorage.removeItem('connected');
      setConnected(false);
      // Rediriger l'utilisateur vers la page de connexion après déconnexion
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
          <input
            id="cityNameInput"
            type="text"
            placeholder="Add new city"
            value={cityNameInput}
            onChange={(e) => setCityNameInput(e.target.value)}
          />
          <button id="addCity" onClick={addCity}>
            <img id="glass" src="images/glass.png" alt="Search" />
          </button>
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
            <button className="deleteCity" onClick={() => deleteCity(userLocation.cityName)}>Delete</button>
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
