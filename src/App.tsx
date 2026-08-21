import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home/Home';
import { World } from './pages/World/World';
import { Library } from './pages/Library/Library';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mundo" element={<World />} />
        <Route path="/biblioteca" element={<Library />} />
        {/* Futuras rutas irán aquí */}
      </Routes>
    </Router>
  );
};

export default App;
