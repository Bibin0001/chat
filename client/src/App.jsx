import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute.js'
import React, { useState, useEffect } from 'react';


function App() {
  const [token, setToken] = useState(document.cookie.split('=')[1]);

  const HomeRoute = () => {

    return token ? <Home /> : <Navigate to="/login" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path='login/' element={< Login/>}> </Route>
        <Route path='register/' element={< Register/>}> </Route>
        <Route path='/' element={<HomeRoute />}> </Route>

      </Routes>
    </BrowserRouter>
      );
}

export default App;
