// server.js

// Load environment variables (like PORT and DATABASE_URL)
require('dotenv').config(); 

const express = require('express');
const { PrismaClient } = require('@prisma/client'); // Mandatory ORM client
const cors = require('cors'); // Required for connecting frontend to backend

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

// --- Middleware ---
// 1. Allows cross-origin requests
app.use(cors()); 
// 2. Allows Express to read JSON body in POST requests
app.use(express.json()); 

// Simple test route
app.get('/', (req, res) => {
  res.send('Polling System Backend is running!');
});

// ----------------------------------------------------------------------
// --- API 1: POST /vote (Vote Submission) ---
// Route: http://localhost:3000/vote
// ----------------------------------------------------------------------
app.post('/vote', async (req, res) => {
  // Destructure required fields
  const { name, voting_choice, casted_at } = req.body;

  // Input Validation
  if (!name || voting_choice === undefined || !casted_at) {
    [cite_start]// Provide meaningful feedback [cite: 121, 122]
    return res.status(400).json({ 
      error: 'Missing required fields: name, voting_choice (true/false), and casted_at (date/time).' 
    });
  }

  try {
    const newVote = await prisma.vote.create({
      data: {
        name: name,
        voting_choice: voting_choice, 
        // CRITICAL FIX: Converts date string (YYYY-MM-DD) to an unambiguous ISO timestamp for the database.
        casted_at: new Date(casted_at + 'T00:00:00.000Z'), 
      },
    });

    // Success response
    res.status(201).json({ 
      message: 'Vote cast successfully!', 
      vote: newVote 
    });

  } catch (error) {
    console.error("Error casting vote:", error.message);
    // Graceful server error handling
    res.status(500).json({ 
      error: 'An internal server error occurred.' 
    });
  }
});


// ----------------------------------------------------------------------
// --- API 2: GET /data (Fetch all votes for the table) ---
// Route: http://localhost:3000/data
// ----------------------------------------------------------------------
app.get('/data', async (req, res) => {
  try {
    [cite_start]// Fetch all votes for the table display [cite: 37]
    const allVotes = await prisma.vote.findMany({
      orderBy: {
        casted_at: 'desc', 
      },
      select: {
        id: true,
        name: true,
        voting_choice: true,
        casted_at: true,
      }
    });

    [cite_start]// Format the response structure as required [cite: 39-47]
    res.status(200).json({ 
      data: allVotes 
    });

  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ 
      error: 'An internal server error occurred while fetching vote data.' 
    });
  }
});


// ----------------------------------------------------------------------
// --- API 3: GET /counts (Line Chart Data: Votes vs. Time) ---
// Route: http://localhost:3000/counts?voting_choice=true
// ----------------------------------------------------------------------
app.get('/counts', async (req, res) => {
  const choiceParam = req.query.voting_choice;

  // Validation
  if (!choiceParam || (choiceParam !== 'true' && choiceParam !== 'false')) {
    return res.status(400).json({ 
      error: 'Missing or invalid query parameter: voting_choice must be "true" or "false".' 
    });
  }

  const choice = choiceParam === 'true'; 

  try {
    // Use a raw query to group data by day for the Line Chart
    const countsPerDay = await prisma.$queryRaw`
      SELECT 
          COUNT(id) as count, 
          DATE(casted_at) as casted_at_date
      FROM 
          votes
      WHERE 
          voting_choice = ${choice}
      GROUP BY 
          casted_at_date
      ORDER BY 
          casted_at_date ASC;
    `;
    
    [cite_start]// Format the response structure to match the requirement [cite: 51-57]
    const formattedData = countsPerDay.map(row => ({
      count: Number(row.count), 
      casted_at: row.casted_at_date, // X-axis is date of casting votes [cite: 13]
    }));


    res.status(200).json({ 
      data: formattedData 
    });

  } catch (error) {
    console.error("Error fetching vote counts:", error.message);
    res.status(500).json({ 
      error: 'An internal server error occurred while fetching chart data.' 
    });
  }
});


// ----------------------------------------------------------------------
// --- API 4: GET /results (Bar Graph Data: Overall Score) ---
// Route: http://localhost:3000/results
// ----------------------------------------------------------------------
app.get('/results', async (req, res) => {
  try {
    // Group all votes by voting_choice to get total counts
    const results = await prisma.vote.groupBy({
      by: ['voting_choice'],
      _count: {
        id: true, 
      },
    });

    // Format the data
    const formattedData = results.map(row => ({
        count: row._count.id, // Y-axis is number of votes [cite: 17]
        voting_choice: row.voting_choice, // X-axis is the two choices [cite: 16]
    }));

    // Initialize with 0 for both choices in case no votes exist
    let finalResults = [
        { count: 0, voting_choice: true },
        { count: 0, voting_choice: false }
    ];

    [cite_start]// Merge the database results into the final structure [cite: 63-66]
    formattedData.forEach(item => {
        if (item.voting_choice === true) {
            finalResults[0].count = item.count;
        } else if (item.voting_choice === false) {
            finalResults[1].count = item.count;
        }
    });

    res.status(200).json({ 
      data: finalResults
    });

  } catch (error) {
    console.error("Error fetching bar graph results:", error.message);
    res.status(500).json({ 
      error: 'An internal server error occurred while fetching results.' 
    });
  }
});


// --- Start the server ---
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});