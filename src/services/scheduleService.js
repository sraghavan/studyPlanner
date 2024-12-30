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

    // Create a blob with the JSON data
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    
    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    link.download = `study_schedule_${date}.json`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error saving schedule:', error);
    throw error;
  }
}; 