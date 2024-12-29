import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Divider
} from '@mui/material';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import SubjectIcon from '@mui/icons-material/Subject';
import PrintIcon from '@mui/icons-material/Print';
import DateView from './DashboardViews/DateView';
import SubjectView from './DashboardViews/SubjectView';
import { format } from 'date-fns';
import '../styles/Dashboard.css';
import DatePrintView from './PrintViews/DatePrintView';
import SubjectPrintView from './PrintViews/SubjectPrintView';

function Dashboard() {
  const [schedule, setSchedule] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('date'); // 'date' or 'subject'

  const fetchSchedule = useCallback(async () => {
    try {
      const response = await fetch('/api/schedule');
      if (!response.ok) {
        throw new Error('Failed to load schedule');
      }
      const data = await response.json();
      setSchedule(data);
      setError(null);
    } catch (error) {
      console.error('Error loading schedule:', error);
      setError('Failed to load schedule. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <Typography>Loading schedule...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!schedule?.schedule) return <Typography>No schedule data available.</Typography>;

  return (
    <Box sx={{ p: 3, '@media print': { p: 1 } }}>
      <Paper sx={{ p: 3, '@media print': { boxShadow: 'none', p: 0 } }}>
        {/* Screen View */}
        <Box className="screen-only">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3
          }}>
            <Typography variant="h4">Study Schedule</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewChange}
                aria-label="view mode"
                size="small"
              >
                <ToggleButton value="date" aria-label="date view">
                  <CalendarViewMonthIcon sx={{ mr: 1 }} />
                  Date
                </ToggleButton>
                <ToggleButton value="subject" aria-label="subject view">
                  <SubjectIcon sx={{ mr: 1 }} />
                  Subject
                </ToggleButton>
              </ToggleButtonGroup>
              <Button
                variant="contained"
                startIcon={<PrintIcon />}
                onClick={handlePrint}
              >
                Print
              </Button>
            </Box>
          </Box>

          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Last Updated: {format(new Date(schedule.lastUpdated), 'MMMM d, yyyy h:mm a')}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {viewMode === 'date' ? (
            <DateView schedule={schedule.schedule} />
          ) : (
            <SubjectView schedule={schedule.schedule} />
          )}
        </Box>

        {/* Print View */}
        <Box className="print-only">
          {viewMode === 'date' ? (
            <DatePrintView schedule={schedule.schedule} />
          ) : (
            <SubjectPrintView schedule={schedule.schedule} />
          )}
        </Box>
      </Paper>
    </Box>
  );
}

export default Dashboard; 