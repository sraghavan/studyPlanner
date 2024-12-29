import { Box, Paper, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';

function WeeklyView({ date, onDaySelect, onBackClick }) {
  return (
    <Paper sx={{ margin: 2, padding: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={onBackClick}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">Weekly Schedule</Typography>
      </Box>
      <Box sx={{ height: 'calc(100vh - 150px)' }}>
        <FullCalendar
          plugins={[timeGridPlugin]}
          initialView="timeGridWeek"
          initialDate={date}
          headerToolbar={{
            left: 'prev,next',
            center: 'title',
            right: ''
          }}
          dateClick={(info) => onDaySelect(info.date)}
        />
      </Box>
    </Paper>
  );
}

export default WeeklyView; 