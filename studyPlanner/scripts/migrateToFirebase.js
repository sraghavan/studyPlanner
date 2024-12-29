import { ref, set } from 'firebase/database';
import { db } from '../src/firebase';
import fs from 'fs/promises';

async function migrateData() {
  try {
    // Read the existing JSON file
    const data = await fs.readFile('./public/data/mySchedule.json', 'utf8');
    const scheduleData = JSON.parse(data);

    // Write to Firebase
    const scheduleRef = ref(db, 'schedule');
    await set(scheduleRef, scheduleData);
    
    console.log('Data migration successful!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrateData(); 