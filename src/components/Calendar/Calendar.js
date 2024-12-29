import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Box, Paper } from '@mui/material';

function Calendar({ onDateSelect }) {
  return (
    <Paper sx={{ margin: 2, padding: 2 }}>
      <Box sx={{ height: 'calc(100vh - 100px)' }}>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth'
          }}
          dateClick={(info) => onDateSelect(info.date)}
        />
      </Box>
    </Paper>
  );
}

export default Calendar; 