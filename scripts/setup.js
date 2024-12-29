const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../public/data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const scheduleFile = path.join(dataDir, 'mySchedule.json');
if (!fs.existsSync(scheduleFile)) {
  fs.writeFileSync(scheduleFile, JSON.stringify({
    lastUpdated: new Date().toISOString(),
    schedule: {}
  }, null, 2));
} 