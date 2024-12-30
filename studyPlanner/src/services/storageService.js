const STORAGE_KEY = 'study_sessions';

export const saveStudySessions = (sessions) => {
  try {
    console.log('Saving to localStorage:', sessions);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    const saved = localStorage.getItem(STORAGE_KEY);
    console.log('Verified saved data:', JSON.parse(saved));
    return true;
  } catch (error) {
    console.error('Error saving study sessions:', error);
    return false;
  }
};

export const loadStudySessions = () => {
  try {
    const sessions = localStorage.getItem(STORAGE_KEY);
    if (!sessions) return {};
    
    const parsedSessions = JSON.parse(sessions);
    
    // Normalize the data structure
    const normalizedSessions = {};
    Object.entries(parsedSessions).forEach(([id, session]) => {
      normalizedSessions[id] = {
        ...session,
        start: new Date(session.start),
        end: new Date(session.end),
        completed: session.completed || false,
        color: session.completed ? '#4caf50' : '#1976d2'
      };
    });
    
    return normalizedSessions;
  } catch (error) {
    console.error('Error loading study sessions:', error);
    return {};
  }
}; 