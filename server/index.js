const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();

// More specific CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: false,
  optionsSuccessStatus: 200
}));

app.use(express.json());

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get schedule
app.get('/api/schedule', async (req, res) => {
  try {
    const filePath = path.join(__dirname, '../public/data/mySchedule.json');
    const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
    
    if (!fileExists) {
      const initialData = {
        lastUpdated: new Date().toISOString(),
        schedule: {}
      };
      await fs.writeFile(filePath, JSON.stringify(initialData, null, 2));
      return res.json(initialData);
    }

    const data = await fs.readFile(filePath, 'utf8');
    return res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading schedule:', error);
    return res.status(500).json({ error: 'Failed to read schedule' });
  }
});

// Save schedule
app.post('/api/save-schedule', async (req, res) => {
  try {
    const filePath = path.join(__dirname, '../public/data/mySchedule.json');
    await fs.writeFile(filePath, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving schedule:', error);
    res.status(500).json({ error: 'Failed to save schedule' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 