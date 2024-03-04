import SignIn from "./SignIn";
import SignUp from "./SignUp";
import '../styles/login.css';
import { useNavigate, } from 'react-router-dom';
import { useState } from "react";


function Login(){

  const [connected, setConnected] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    setConnected(true); // Met à jour l'état de connexion
    localStorage.setItem('connected', connected); // Stocke l'état de connexion dans le stockage local
    navigate("/"); // Redirige vers la page d'accueil après connexion réussie
  };

  return (
    <>
    <div className="container">
        <SignIn onLoginSuccess={handleLoginSuccess} />
        <SignUp onLoginSuccess={handleLoginSuccess} />
    </div>
    </>
  )
}


export default Login