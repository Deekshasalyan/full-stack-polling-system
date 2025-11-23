// src/components/BarChartComponent.jsx
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
// IMPORTANT: Register the necessary components from Chart.js
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registering components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RESULTS_API_URL = 'http://localhost:3000/results';

const BarChartComponent = () => {
  const [chartData, setChartData] = useState({
    labels: ['Yes (True)', 'No (False)'], // X-axis labels [cite: 16]
    datasets: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch data for the Bar Graph
  const fetchBarData = async () => {
    setLoading(true);
    try {
      const response = await fetch(RESULTS_API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      
      // Extract counts for true and false choices from the API response [cite: 63-66]
      const yesCount = result.data.find(item => item.voting_choice === true)?.count || 0;
      const noCount = result.data.find(item => item.voting_choice === false)?.count || 0;

      // Update Chart.js data structure
      setChartData({
        labels: ['Yes (True)', 'No (False)'],
        datasets: [
          {
            label: 'Total Votes',
            data: [yesCount, noCount], // Y-axis data [cite: 17]
            backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'], // Different colors [cite: 14]
            borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
            borderWidth: 1,
          },
        ],
      });
      setError(null);
    } catch (err) {
      console.error("Error fetching bar chart data:", err);
      setError("Failed to load bar chart data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Overall Score for Each Choice' },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Number of Votes' }, // Y axis label [cite: 17]
        ticks: { stepSize: 1 }
      }
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto' }}>
      <h3>2. Overall Results (Bar Graph)</h3>
      {loading ? <p>Loading chart data...</p> : error ? <p className="error">{error}</p> : <Bar data={chartData} options={options} />}
    </div>
  );
};

export default BarChartComponent;