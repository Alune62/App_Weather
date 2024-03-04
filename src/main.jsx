//import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx'
import SignIn from './SignIn.jsx'
import SignUp from './SignUp.jsx'
import Login from './login.jsx';
// import { SignIn, SignUp } from './login.jsx';



ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route index element={<App />}  /> 
      <Route path='/' element={<App />} />
      <Route path='/login' element={<Login />} />
      <Route path='/SignIn' element={<SignIn />} />
      <Route path='/SignUp' element={<SignUp />} />
    </Routes>
    
  
  </BrowserRouter>,
)
