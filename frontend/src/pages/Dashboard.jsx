// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BarChartComponent from '../components/BarChartComponent'; // Will create soon
import LineChartComponent from '../components/LineChartComponent'; // Will create soon

const DATA_API_URL = 'http://localhost:3000/data';

// Helper function to format the timestamp
const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  // Use Intl.DateTimeFormat for robust formatting
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(timestamp).toLocaleDateString(undefined, options);
};

function Dashboard() {
  const [allVotes, setAllVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch all vote data for the table
  const fetchAllVotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(DATA_API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      // The API response is expected to be { data: [...] }
      setAllVotes(result.data || []); 
    } catch (err) {
      console.error("Error fetching all votes:", err);
      setError("Failed to load vote data. Ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchAllVotes();
  }, []);

  return (
    <div className="dashboard">
      <h2>Screen 2: Trend Analysis Dashboard 📈</h2>
      
      <Link to="/poll">
        <button className="secondary-button">Cast Another Vote</button>
      </Link>
      <button onClick={fetchAllVotes} style={{marginLeft: '10px'}}>Refresh Data</button>

      <div className="charts-container">
        {/* Components for charts will go here later */}
        <BarChartComponent />
        <LineChartComponent />
      </div>

      ---

      <h3>1. All Votes Table</h3>
      {loading && <p>Loading vote data...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="table-container">
          {allVotes.length === 0 ? (
            <p>No votes cast yet. Go to the Poll Station to submit one!</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Vote Choice</th>
                  <th>Date of Submission</th>
                </tr>
              </thead>
              <tbody>
                {allVotes.map((vote) => (
                  <tr key={vote.id}>
                    <td>{vote.id}</td>
                    <td>{vote.name}</td>
                    {/* Display True/False as Yes/No */}
                    <td>{vote.voting_choice ? 'Yes (True)' : 'No (False)'}</td>
                    <td>{formatDate(vote.casted_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;