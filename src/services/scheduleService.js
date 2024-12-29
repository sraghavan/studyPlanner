export const formatScheduleForSave = (sessions) => {
  // Group sessions by subject and month
  return Object.values(sessions).reduce((acc, session) => {
    const month = new Date(session.start).toLocaleString('default', { month: 'long', year: 'numeric' });
    const subject = session.subject;

    if (!acc[month]) {
      acc[month] = {};
    }
    if (!acc[month][subject]) {
      acc[month][subject] = [];
    }

    acc[month][subject].push({
      topic: session.topic,
      date: new Date(session.start).toLocaleDateString(),
      startTime: new Date(session.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: new Date(session.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      completed: session.completed,
      recurrence: session.recurrence
    });

    return acc;
  }, {});
};

export const saveScheduleToFile = async (schedule) => {
  try {
    const data = {
      lastUpdated: new Date().toISOString(),
      schedule: formatScheduleForSave(schedule)
    };

    const response = await fetch('/api/save-schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to save schedule');
    }
    
    return true;
  } catch (error) {
    console.error('Error saving schedule:', error);
    throw error;
  }
}; 