import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import CaptaiLogin from './pages/CaptaiLogin';
import CaptainRegister from './pages/CaptainRegister';



const App = () => {
  return (
    <Routes>

      <Route path="/" element={<Home />} />
      <Route path="/user-login" element={<UserLogin />} />
      <Route path="/user-register" element={<UserRegister />} />
      <Route path="/captain-login" element={<CaptaiLogin />} />
      <Route path="/captain-register" element={<CaptainRegister />} />
    </Routes>
  );
}

export default App;
