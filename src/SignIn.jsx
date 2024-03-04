import { useState } from 'react';
import '../styles/login.css'
//import { useNavigate } from 'react-router-dom';

function SignIn({onLoginSuccess}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  //const navigate = useNavigate()

  const handleSignIn = async () => {
    // Envoyer les informations de connexion à l'API
    const response = await fetch('https://backend-weather-l7yp8fame-alune62.vercel.app/users/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (data.result) {
      onLoginSuccess(); // Appel à handleLoginSuccess
    } else {
      // Erreur de connexion
      setError(data.error);
    }
  };

  return (
    <div className="connexionCard">
      <h1>Se connecter</h1>
      <input
        id="signInEmail"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /> 
      <input
        id="signInPassword"
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button id="signInButton" onClick={handleSignIn}>Se connecter</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default SignIn;
