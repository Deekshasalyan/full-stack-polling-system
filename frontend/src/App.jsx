// src/App.jsx - REPLACED CONTENT
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar'; // New import
import PollStation from './pages/PollStation';
import Dashboard from './pages/Dashboard';
import './App.css'; 

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation Bar at the top */}
        <NavBar /> 
        <div className="content-container"> {/* New container for main content */}
          <Routes>
            <Route path="/" element={<Navigate to="/poll" />} />
            <Route path="/poll" element={<PollStation />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;