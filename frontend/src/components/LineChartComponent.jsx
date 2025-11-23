// src/components/LineChartComponent.jsx
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
// IMPORTANT: Register the necessary components from Chart.js
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Registering components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const COUNTS_API_URL_BASE = 'http://localhost:3000/counts?voting_choice=';

const LineChartComponent = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch data for both true and false choices
  const fetchLineData = async () => {
    setLoading(true);
    try {
      const [responseTrue, responseFalse] = await Promise.all([
        fetch(`${COUNTS_API_URL_BASE}true`),
        fetch(`${COUNTS_API_URL_BASE}false`),
      ]);

      const dataTrue = await responseTrue.json();
      const dataFalse = await responseFalse.json();

      if (!responseTrue.ok || !responseFalse.ok) {
         throw new Error("Failed to fetch one or both count APIs.");
      }

      // 1. Combine all unique dates for the X-axis
      const allDates = [
        ...new Set([
          ...(dataTrue.data || []).map(d => d.casted_at),
          ...(dataFalse.data || []).map(d => d.casted_at),
        ]),
      ].sort(); // Sort dates chronologically

      // 2. Map counts to the combined date labels
      const getCountsByDate = (data) => {
        const dateMap = data.reduce((acc, curr) => {
          acc[curr.casted_at] = curr.count;
          return acc;
        }, {});
        // Ensure every date has a value (0 if no votes that day)
        return allDates.map(date => dateMap[date] || 0); 
      };

      const trueCounts = getCountsByDate(dataTrue.data || []);
      const falseCounts = getCountsByDate(dataFalse.data || []);

      // 3. Update Chart.js data structure [cite: 11-14]
      setChartData({
        labels: allDates, // X-axis: Date of casting votes [cite: 13]
        datasets: [
          {
            label: 'Yes (True) Votes',
            data: trueCounts, // Y-axis: Number of votes cast [cite: 13]
            borderColor: 'rgba(75, 192, 192, 1)', // Line 1 color [cite: 14]
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            tension: 0.1,
          },
          {
            label: 'No (False) Votes',
            data: falseCounts,
            borderColor: 'rgba(255, 99, 132, 1)', // Line 2 color [cite: 14]
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            tension: 0.1,
          },
        ],
      });
      setError(null);
    } catch (err) {
      console.error("Error fetching line chart data:", err);
      setError("Failed to load line chart data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLineData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Number of Votes vs. Time Trend' },
    },
    scales: {
      x: {
        title: { display: true, text: 'Date of Casting Votes' } // X axis label [cite: 13]
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Number of Votes Cast' }, // Y axis label [cite: 13]
        ticks: { stepSize: 1 }
      }
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto' }}>
      <h3>3. Vote Trends (Line Chart)</h3>
      {loading ? <p>Loading chart data...</p> : error ? <p className="error">{error}</p> : <Line data={chartData} options={options} />}
    </div>
  );
};

export default LineChartComponent;