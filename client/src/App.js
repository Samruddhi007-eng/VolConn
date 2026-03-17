import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your pages
import Login from './pages/Login';
import VolunteerDashboard from './pages/VolunteerDashboard';
import NGODashboard from './pages/NGODashboard';
import Register from './pages/Register';

// Inside your <Routes> block:

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Dashboard Routes */}
          <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
          <Route path="/ngo-dashboard" element={<NGODashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;