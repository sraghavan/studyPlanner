const fs = require('fs').promises;
const path = require('path');

export const ensureDataDirectory = async () => {
  const dataDir = path.join(process.cwd(), 'public/data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
  return dataDir;
}; 