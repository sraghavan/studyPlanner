import { useState, useEffect, useRef, useMemo, memo, useCallback } from 'react';
import { 
  Box, 
  Typography,
  Paper,
  Grid,
  ButtonBase,
  Button,
  Stack,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { format, addMonths } from 'date-fns';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import StudyDialog from './StudyDialog';
import './StudyPlanner.css';
import { saveStudySessions, loadStudySessions } from '../services/storageService';
import SaveIcon from '@mui/icons-material/Save';
import { saveScheduleToFile } from '../services/scheduleService';
import { renderEventContent } from './EventContent';

function StudyPlanner() {
  // Generate months once using useMemo
  const months = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const date = addMonths(new Date(), i);
      return {
        value: format(date, 'yyyy-MM'),
        label: format(date, 'MMMM yyyy'),
        date: date
      };
    });
  }, []);

  // Initialize all state with useMemo to prevent unnecessary re-renders
  const [selectedMonth, setSelectedMonth] = useState(() => months[0]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [studySessions, setStudySessions] = useState(() => {
    // Load sessions synchronously during initialization
    try {
      return loadStudySessions() || {};
    } catch (error) {
      console.error('Error loading initial sessions:', error);
      return {};
    }
  });
  const [editData, setEditData] = useState(null);
  const calendarRef = useRef(null);
  const [saveStatus, setSaveStatus] = useState({
    saving: false,
    message: '',
    show: false
  });

  // Memoize calendar events to prevent unnecessary re-renders
  const calendarEvents = useMemo(() => {
    return Object.values(studySessions);
  }, [studySessions]);

  // Remove the auto-save effect that was causing recursive calls
  useEffect(() => {
    if (Object.keys(studySessions).length > 0) {
      saveStudySessions(studySessions);  // Only save to localStorage
    }
  }, [studySessions]);

  // Memoize the calendar options to prevent re-renders
  const calendarOptions = useMemo(() => ({
    plugins: [timeGridPlugin, interactionPlugin],
    initialView: "timeGridWeek",
    initialDate: selectedMonth?.date || new Date(),
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    allDaySlot: false,
    slotMinTime: "04:00:00",
    slotMaxTime: "21:00:00",
    expandRows: true,
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: ''
    },
    eventOverlap: false,
    selectOverlap: false,
    editable: false,
    eventDurationEditable: false,
    eventStartEditable: false,
    eventResourceEditable: false,
    slotEventOverlap: false
  }), [selectedMonth]);

  const handleSaveStudy = (studyData) => {
    const eventId = editData ? editData.id : format(studyData.start, 'yyyy-MM-dd-HH:mm');
    
    const baseEvent = {
      id: eventId,
      title: studyData.topic,
      start: new Date(studyData.start),
      end: new Date(studyData.end),
      subject: studyData.subject,
      topic: studyData.topic,
      completed: editData ? editData.completed : false,
      color: editData?.completed ? '#4caf50' : '#1976d2',
      display: 'block',
      resourceEditable: false,
      durationEditable: false,
      recurrence: studyData.recurrence
    };

    if (!editData && studyData.recurrence.type !== 'none') {
      const newSessions = {};
      const startDate = new Date(studyData.start);
      const endDate = new Date(studyData.end);
      
      switch (studyData.recurrence.type) {
        case 'specific-days': {
          // Generate events for selected days for current month
          const currentMonth = startDate.getMonth();
          const date = new Date(startDate);
          
          while (date.getMonth() === currentMonth) {
            if (studyData.recurrence.daysOfWeek.includes(date.getDay())) {
              const eventDate = new Date(date);
              eventDate.setHours(startDate.getHours());
              eventDate.setMinutes(startDate.getMinutes());
              
              const eventEnd = new Date(eventDate);
              eventEnd.setHours(endDate.getHours());
              eventEnd.setMinutes(endDate.getMinutes());
              
              const recurringEventId = format(eventDate, 'yyyy-MM-dd-HH:mm');
              newSessions[recurringEventId] = {
                ...baseEvent,
                id: recurringEventId,
                start: eventDate,
                end: eventEnd
              };
            }
            date.setDate(date.getDate() + 1);
          }
          break;
        }
        
        case 'whole-week': {
          // Generate events for every day this week
          const weekStart = new Date(startDate);
          weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Go to Sunday
          
          for (let i = 0; i < 7; i++) {
            const eventDate = new Date(weekStart);
            eventDate.setDate(weekStart.getDate() + i);
            eventDate.setHours(startDate.getHours());
            eventDate.setMinutes(startDate.getMinutes());
            
            const eventEnd = new Date(eventDate);
            eventEnd.setHours(endDate.getHours());
            eventEnd.setMinutes(endDate.getMinutes());
            
            const recurringEventId = format(eventDate, 'yyyy-MM-dd-HH:mm');
            newSessions[recurringEventId] = {
              ...baseEvent,
              id: recurringEventId,
              start: eventDate,
              end: eventEnd
            };
          }
          break;
        }
        
        case 'whole-month': {
          // Generate events for every day this month
          const monthStart = new Date(startDate);
          monthStart.setDate(1);
          const currentMonth = monthStart.getMonth();
          
          while (monthStart.getMonth() === currentMonth) {
            const eventDate = new Date(monthStart);
            eventDate.setHours(startDate.getHours());
            eventDate.setMinutes(startDate.getMinutes());
            
            const eventEnd = new Date(eventDate);
            eventEnd.setHours(endDate.getHours());
            eventEnd.setMinutes(endDate.getMinutes());
            
            const recurringEventId = format(eventDate, 'yyyy-MM-dd-HH:mm');
            newSessions[recurringEventId] = {
              ...baseEvent,
              id: recurringEventId,
              start: eventDate,
              end: eventEnd
            };
            
            monthStart.setDate(monthStart.getDate() + 1);
          }
          break;
        }

        default: {
          // Handle single event (no recurrence)
          setStudySessions(prev => ({
            ...prev,
            [eventId]: baseEvent
          }));
          break;
        }
      }
      
      setStudySessions(prev => ({
        ...prev,
        ...newSessions
      }));
    } else {
      setStudySessions(prev => ({
        ...prev,
        [eventId]: baseEvent
      }));
    }

    setEditData(null);
    setDialogOpen(false);
  };

  const handleEventClick = (info) => {
    const isDeleteButton = info.jsEvent.target.closest('.delete-event');
    if (!isDeleteButton) {
      const session = studySessions[info.event.id];
      if (session) {
        // Ensure we have valid Date objects
        const startDate = new Date(session.start);
        const endDate = new Date(session.end);
        
        setEditData({
          ...session,
          start: startDate,
          end: endDate
        });

        setSelectedSlot({
          id: session.id,
          start: startDate,
          end: endDate,
          startTime: format(startDate, 'h:mm a'),
          endTime: format(endDate, 'h:mm a'),
          date: startDate
        });
        
        setDialogOpen(true);
      }
    }
  };

  const handleSelect = (selectInfo) => {
    const startTime = format(selectInfo.start, 'h:mm a');
    const endTime = format(selectInfo.end, 'h:mm a');
    
    setSelectedSlot({
      id: format(selectInfo.start, 'yyyy-MM-dd-HH:mm'),
      start: selectInfo.start,
      end: selectInfo.end,
      startTime,
      endTime,
      date: selectInfo.start
    });
    setDialogOpen(true);
  };

  const handleDeleteEvent = useCallback((eventId) => {
    setStudySessions(prev => {
      const newSessions = { ...prev };
      delete newSessions[eventId];
      return newSessions;
    });
    
    setSaveStatus({
      saving: false,
      message: 'Study session deleted successfully',
      show: true
    });
    
    setTimeout(() => {
      setSaveStatus(prev => ({ ...prev, show: false }));
    }, 3000);
  }, []);

  const handleSaveSchedule = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (saveStatus.saving) return;
    
    setSaveStatus({
      saving: true,
      message: 'Saving...',
      show: true
    });

    try {
      // Save to localStorage
      saveStudySessions(studySessions);
      
      // Save to file
      await saveScheduleToFile(studySessions);
      
      setSaveStatus({
        saving: false,
        message: 'Schedule saved successfully!',
        show: true
      });
      
      // Keep success message visible
      setTimeout(() => {
        setSaveStatus(prev => ({
          ...prev,
          show: false
        }));
      }, 3000);

    } catch (error) {
      console.error('Error saving schedule:', error);
      setSaveStatus({
        saving: false,
        message: 'Failed to save schedule',
        show: true
      });
    }
  };

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(month.date);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditData(null);
  };

  // First define handleToggleComplete
  const handleToggleComplete = useCallback((eventId) => {
    setStudySessions(prev => {
      const session = prev[eventId];
      if (!session) return prev;

      const newCompleted = !session.completed;
      
      return {
        ...prev,
        [eventId]: {
          ...session,
          completed: newCompleted,
          color: newCompleted ? '#4caf50' : '#1976d2'
        }
      };
    });
  }, []);

  // Then use it in eventDidMountMemo
  const eventDidMountMemo = useMemo(() => (info) => {
    const deleteButton = info.el.querySelector('.delete-event');
    const completeButton = info.el.querySelector('.complete-event');

    if (deleteButton) {
      deleteButton.replaceWith(deleteButton.cloneNode(true));
      const freshButton = info.el.querySelector('.delete-event');
      freshButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this study session?')) {
          handleDeleteEvent(freshButton.dataset.eventId);
        }
      });
    }

    if (completeButton) {
      completeButton.replaceWith(completeButton.cloneNode(true));
      const freshButton = info.el.querySelector('.complete-event');
      freshButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleToggleComplete(freshButton.dataset.eventId);
      });
    }
  }, [handleDeleteEvent, handleToggleComplete]);

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Study Planner</Typography>
          <Button
            variant="contained"
            startIcon={saveStatus.saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            onClick={handleSaveSchedule}
            disabled={Object.keys(studySessions).length === 0 || saveStatus.saving}
            type="button"
          >
            {saveStatus.saving ? 'Saving...' : 'Save Schedule'}
          </Button>
        </Stack>
        
        {/* Month Selector */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>Select Month</Typography>
          <Grid container spacing={2}>
            {months.map((month) => (
              <Grid item xs={6} sm={4} md={2} key={month.value}>
                <ButtonBase 
                  sx={{ width: '100%', textAlign: 'center', borderRadius: 1 }}
                  onClick={() => handleMonthSelect(month)}
                >
                  <Paper
                    elevation={selectedMonth?.value === month.value ? 6 : 1}
                    sx={{ 
                      p: 2, 
                      width: '100%',
                      bgcolor: selectedMonth?.value === month.value ? 'primary.main' : 'background.paper',
                      color: selectedMonth?.value === month.value ? 'primary.contrastText' : 'text.primary',
                      transition: 'all 0.3s',
                      '&:hover': {
                        bgcolor: selectedMonth?.value === month.value 
                          ? 'primary.dark'
                          : 'action.hover'
                      }
                    }}
                  >
                    <Typography variant="body1">{format(month.date, 'MMM')}</Typography>
                    <Typography variant="caption">{format(month.date, 'yyyy')}</Typography>
                  </Paper>
                </ButtonBase>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Calendar View */}
        {selectedMonth && (
          <Box sx={{ height: 'calc(100vh - 300px)' }}>
            <FullCalendar
              {...calendarOptions}
              ref={calendarRef}
              select={handleSelect}
              eventClick={(info) => {
                const isDeleteButton = info.jsEvent.target.closest('.delete-event');
                if (!isDeleteButton) {
                  handleEventClick(info);
                }
              }}
              events={calendarEvents}
              eventContent={renderEventContent}
              eventDidMount={eventDidMountMemo}
            />
          </Box>
        )}
      </Box>

      <StudyDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        selectedSlot={selectedSlot}
        onSave={handleSaveStudy}
        editMode={!!editData}
        editData={editData}
      />

      <Snackbar 
        open={saveStatus.show}
        anchorOrigin={{ 
          vertical: 'top',
          horizontal: 'center'
        }}
        sx={{ 
          position: 'fixed',
          top: { xs: 16, sm: 24 },
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10000
        }}
      >
        <Alert 
          severity={saveStatus.saving ? 'info' : 'success'}
          variant="filled"
          sx={{ 
            minWidth: '300px',
            boxShadow: 3,
            '& .MuiAlert-message': {
              fontSize: '1rem',
              fontWeight: 500
            }
          }}
        >
          {saveStatus.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default memo(StudyPlanner); 