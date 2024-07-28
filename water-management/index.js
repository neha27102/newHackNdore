const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// MySQL connection setup
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root', // replace with your MySQL root password
  database: 'my_database', // replace with your database name
});

// Ensure database connection
db.getConnection((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Data file paths
const USAGE_FILE = path.join(__dirname, 'data', 'usage.json');
const LEAKAGE_FILE = path.join(__dirname, 'data', 'leakage.json');

// Ensure data directory exists
fs.mkdir(path.join(__dirname, 'data')).catch(() => {});

// Helper functions to read and write JSON files
async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeJsonFile(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// API endpoints
app.get('/api/dashboard', async (req, res) => {
  const usageData = await readJsonFile(USAGE_FILE);
  const leakageData = await readJsonFile(LEAKAGE_FILE);

  const totalUsage = usageData.reduce((sum, record) => sum + record.amount, 0);
  const totalLeakage = leakageData.reduce((sum, record) => sum + record.amount, 0);
  const efficiency = totalUsage === 0 ? 0 : ((totalUsage - totalLeakage) / totalUsage) * 100;

  res.json({ totalUsage, totalLeakage, efficiency });
});

app.get('/api/usage', async (req, res) => {
  const usageData = await readJsonFile(USAGE_FILE);
  res.json(usageData);
});

app.get('/api/leakage', async (req, res) => {
  const leakageData = await readJsonFile(LEAKAGE_FILE);
  res.json(leakageData);
});

app.post('/api/usage', async (req, res) => {
  const newUsage = req.body;
  const usageData = await readJsonFile(USAGE_FILE);
  usageData.push(newUsage);
  await writeJsonFile(USAGE_FILE, usageData);
  res.status(201).json(newUsage);
});

app.post('/api/leakage', async (req, res) => {
  const newLeakage = req.body;
  const leakageData = await readJsonFile(LEAKAGE_FILE);
  leakageData.push(newLeakage);
  await writeJsonFile(LEAKAGE_FILE, leakageData);
  res.status(201).json(newLeakage);
});

// Serve static files (HTML, CSS)
app.use(express.static('public'));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
