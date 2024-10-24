const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3000;

// Use CORS middleware
app.use(cors());
app.use(express.json()); // Middleware for parsing JSON

// Create server
app.listen(port, () => {
  console.log(`API Server running on http://localhost:${port}`);
});

// GET /configs/:id - Retrieve Drone configuration
app.get('/configs/:id', async (req, res) => {
    const { id } = req.params;  // Get Drone ID from URL
    try {
        const response = await axios.get('https://script.google.com/macros/s/AKfycbzwclqJRodyVjzYyY-NTQDb9cWG6Hoc5vGAABVtr5-jPA_ET_2IasrAJK4aeo5XoONiaA/exec');
        const config = response.data; // Assume response contains configuration

        console.log(config); // Check the API response

        // Adjust max_speed based on given conditions
        if (!config.max_speed) {
            config.max_speed = 100;
        } else if (config.max_speed > 110) {
            config.max_speed = 110;
        }

        res.json(config); // Send configuration back to the caller
    } catch (error) {
        res.status(500).json({ message: 'Error fetching config data', error });
    }
});

// GET /status/:id - Retrieve Drone status
app.get('/status/:id', (req, res) => {
  const { id } = req.params;
  const status = {
      condition: 'good'
  };

  res.json(status);
});

// GET /logs - Retrieve logs from external API
app.get('/logs', async (req, res) => {
  try {
    let allLogs = [];
    let currentPage = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      const response = await axios.get(`https://app-tracking.pockethost.io/api/collections/drone_logs/records?page=${currentPage}`);
      const logs = response.data.items;

      if (!logs || logs.length === 0) {
        hasMorePages = false;
      } else {
        allLogs = allLogs.concat(logs);
        currentPage++;
      }
    }

    // การจัดเรียงข้อมูลจากวันที่ล่าสุด
    const sortedLogs = allLogs.sort((a, b) => new Date(b.created) - new Date(a.created));

    res.json(sortedLogs); // ส่ง log ที่เรียงแล้ว
  } catch (error) {
    res.status(500).json({ message: 'Error fetching logs', error });
  }
});


// POST /logs - Add a new log to the external API
app.post('/logs', async (req, res) => {
  const newLog = req.body;

  // Validate log data
  if (!newLog.drone_id || !newLog.drone_name || !newLog.country || newLog.celsius === undefined) {
    return res.status(400).json({ message: 'Invalid log data' });
  }

  // Add created timestamp
  newLog.created = new Date().toISOString();

  try {
    // Post the new log to the external API
    const response = await axios.post('https://app-tracking.pockethost.io/api/collections/drone_logs/records', newLog);
    res.status(201).json({ message: 'Log added successfully', log: response.data });
  } catch (error) {
    res.status(500).json({ message: 'Error adding log', error });
  }
});
