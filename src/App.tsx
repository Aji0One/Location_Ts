import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import Dashboard from './Pages/Dashboard';
import GeoLocation from './Pages/GeoLocation';


function App() {






  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/map' element={<GeoLocation />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
