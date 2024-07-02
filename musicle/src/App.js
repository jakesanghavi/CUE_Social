import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import Home from './pages/Home';

function App() {
  
  return (
    <div className="App" id="app" style={{ backgroundColor: '#ECE5F0', height: '100vh' }}>
      <BrowserRouter>
        <div className='pages'>
          <Routes>
          <Route
              path="/"
              element={<Home/>}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
