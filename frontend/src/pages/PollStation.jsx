// src/pages/PollStation.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = 'http://localhost:3000/vote';

function PollStation() {
  const navigate = useNavigate();

  // 1. State for form inputs
  const [formData, setFormData] = useState({
    name: '',
    voting_choice: true, // Default to true/Yes
    casted_at: new Date().toISOString().split('T')[0], // Default to today's date in YYYY-MM-DD format
  });

  // State for messages
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // 2. Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      // Handle checkbox/boolean input correctly
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // 3. Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('Submitting vote...');
    setIsSuccess(false);

    // Prepare the request body
    if (!formData.name) {
        setStatusMessage('❌ Please enter your Name before casting a vote.');
        setIsSuccess(false);
        return;
    }
    const requestBody = {
      name: formData.name,
      // Ensure voting_choice is a boolean [cite: 29]
      voting_choice: formData.voting_choice, 
      // Ensure casted_at includes time component (using date string for simplicity) [cite: 30]
      casted_at: formData.casted_at, 
    };
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        // Success handling
        setStatusMessage(`✅ Vote successfully cast for ${formData.name}!`);
        setIsSuccess(true);
        // Optional: Reset name field only after successful submission
        setFormData(prev => ({ ...prev, name: '' })); 

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);

      } else {
        // Error handling based on backend response (e.g., 400 Bad Request)
        setStatusMessage(`❌ Submission Failed: ${data.error || 'Unknown error'}`);
        setIsSuccess(false);
      }
    } catch (error) {
      // Network error handling
      console.error('Network Error:', error);
      setStatusMessage('❌ Network error: Could not connect to the server.');
      setIsSuccess(false);
    }
  };

  return (
    <div className="poll-station">
      <h2> Poll Station 🗳️</h2>
      <p>Enter your name and choose your option (Yes/No) along with the date of casting. [cite: 3]</p>

      <div className={`status-message ${isSuccess ? 'success' : 'error'}`}>
        {statusMessage}
      </div>

      <form onSubmit={handleSubmit} className="vote-form">
        
        {/* Name Input [cite: 5] */}
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Larry Page"
            required
          />
        </div>

        {/* Vote Choice Input (True/False or Yes/No) [cite: 6] */}
        <div className="form-group">
          <label htmlFor="voting_choice">Vote Choice (Yes / No):</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="voting_choice"
                value={true}
                checked={formData.voting_choice === true}
                onChange={() => setFormData({ ...formData, voting_choice: true })}
                required
              />
              Yes (True)
            </label>
            <label>
              <input
                type="radio"
                name="voting_choice"
                value={false}
                checked={formData.voting_choice === false}
                onChange={() => setFormData({ ...formData, voting_choice: false })}
                required
              />
              No (False)
            </label>
          </div>
        </div>

        {/* Date of Submission Input [cite: 7] */}
        <div className="form-group">
          <label htmlFor="casted_at">Date of Submission:</label>
          <input
            type="date"
            id="casted_at"
            name="casted_at"
            value={formData.casted_at}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Cast Vote</button>
      </form>
      
      <hr />
      <Link to="/dashboard">
        <button className="secondary-button">View Trend Analysis Dashboard</button>
      </Link>
    </div>
  );
}

export default PollStation;