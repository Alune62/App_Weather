import '../styles/login.css'
import { useState } from 'react';


function SignUp({onLoginSuccess}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

 

  const handleSignUp = async () => {
    // Envoyer les informations d'inscription à l'API
    const response = await fetch('https://backend-weather-l7yp8fame-alune62.vercel.app/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();

    if (data.result) {
      onLoginSuccess(); // Appel à handleLoginSuccess
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="connexionCard">
      <h1>Créer un compte</h1>
      <input
        id="signUpName"
        type="text"
        placeholder="Nom"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        id="signUpEmail"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        id="signUpPassword"
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button id="signUpButton" onClick={handleSignUp}>Créer un compte</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default SignUp;
